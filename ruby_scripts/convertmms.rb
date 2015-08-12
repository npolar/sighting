#!/usr/bin/env ruby
# Convert from the old mms database to the new sightings database
#
# Author: srldl
#
########################################

require './server'
require './config'
require 'net/http'
require  'net/ssh'
require 'net/scp'
require 'mdb'
require 'time'
require 'date'
require 'json'
require 'oci8'
require 'net-ldap'
require 'rmagick'



module Couch

  class Convertmms

    #Convert to iso8601
    def self.iso8601time(inputdate)
       a = (inputdate).to_s
       b = a.split(" ")
       c = b[0].split("-")
       dt = DateTime.new(c[0].to_i, c[1].to_i, c[2].to_i, 12, 0, 0, 0)
       return dt.to_time.utc.iso8601
    end


    species = {'Ursus maritimus' => 'ursus maritimus',
              'Polar bear den' => 'ursus maritimus',
              'Odobenus rosmarus' => 'odobenus rosmarus',
              'Phoca hispida' => 'pusa hispida',
              'Erignathus barbatus' => 'erignathus barbatus',
              'Phoca vitulina' => 'phoca vitulina',
              'Phoca groenlandica' => 'phoca groenlandica',
              'Cystophora cristata' => 'cystophora cristata',
              'Cetacea'=> '',
              'Dolphin Undetermined' => '',
              'Balaena mysticetus' => 'balaena mysticetus',
              'Delphinapterus leucas' => 'delphinapterus leucas',
              'Monodon monoceros' => 'monodon monoceros',
              'Balaenoptera musculus' => 'balaenoptera musculus',
              'Balaenoptera physalus' => 'balaenoptera physalus',
              'Megaptera novaeangliae' => 'megaptera novaeangliae',
              'Balaenoptera acutorostrata' => 'balaenoptera acutorostrata',
              'Balaenoptera borealis' => 'balaenoptera borealis',
              'Physeter macrocephalus' => 'physeter macrocephalus',
              'Hyperoodon ampullatus' =>'hyperoodon ampullatus',
              'Orcinus orca' => 'orcinus orca',
              'Globicephala melas' => 'globicephala melas',
              'Lagenorhynchus albirostris' => 'lagenorhynchus albirostris',
              'Lagenorhynchus acutus' => '',
              'Lagenorhynchus spp.' => '',
              'Phocoena phocoena' => '',
              'Pinnipedia' => '',
              'Other species' =>'unknown'}

    #Get Oracle server connection
    #Get caroline.npolar.no
    oci = OCI8.new(Couch::Config::USER_MMS,Couch::Config::PASSWORD_MMS,Couch::Config::ORACLE_SID)

    #define the id
    id = nil


    #Fetch observation info
    oci.exec('select * from mms.observations where id>155 and id<160') do |obs|
    # oci.exec('select * from mms.observations') do |obs|



       #Get ready to put into database
       server = Couch::Server.new(Couch::Config::HOST1, Couch::Config::PORT1)

       #Fetch a UUID from courchdb
       res = server.get("/_uuids")


       #Extract the UUID from reply
       uuid = (res.body).split('"')[3]

       #Convert UUID to RFC UUID
       uuid.insert 8, "-"
       uuid.insert 13, "-"
       uuid.insert 18, "-"
       uuid.insert 23, "-"

       #Timestamp
       a = (Time.now).to_s
       b = a.split(" ")
       c = b[0].split("-")
       dt = DateTime.new(c[0].to_i, c[1].to_i, c[2].to_i, 12, 0, 0, 0)
       timestamp = dt.to_time.utc.iso8601

       #Print id for comparison
       puts "Observation: " + obs[0].to_s

       #Define the id
       id = obs[0]

       #Holds LDAP ids to be substituted
       temp_entry = ''
       temp_expedition_created = ''
       temp_expedition_updated = ''
       temp_excelfile = ''

       puts obs[15].class

       #Create the json structure object
       @entry = {
            :id => uuid,
            :_id => uuid,
            :schema => 'http://api.npolar.no/schema/' + Couch::Config::COUCH_DB_NAME + '.json',
            :collection => Couch::Config::COUCH_DB_NAME,
            :base => 'http://api.npolar.no',
            :language => 'en',
            :rights => 'No licence announced on the web site',
            :rights_holder => 'Norwegian Polar Institute',
            :basis_of_record => 'HumanObservation',
            :event_date => iso8601time(obs[10]),
            :locality => obs[13],
            :location_comment => obs[14],
            :latitude => (obs[15]).to_f(),    #Big decimal
            :longitude => (obs[16]).to_f(),   #Big decimal
            :species => species[obs[4]],
            :adult_m => '',
            :adult_f => '',
            :adult => '',
            :sub_adult => '',
            :polar_bear_condition => '',
            :cub_calf_pup => '',
            :bear_cubs => '',
            :unidentified => '',
            :editor_assessment => '',
            :polar_bear_den => unless (obs[4] == nil) then \
                  (species[obs[4].downcase]) == 'polar bear den'? "1" : ""  end,
            :dead_alive => '',
            :total => obs[7].to_s,
            :habitat => obs[9],
            :occurrence_remarks => obs[18] == nil ? "": obs[18],
            :info_comment => 'Old id:' + obs[0].to_s + ', field activity id:' + obs[1].to_s+ ' Platform: ' + obs[2].to_s + ', platform comment: ' + obs[3].to_s + ', species comment: ' + obs[6].to_s \
            + ', total count accuracy: ' + obs[8].to_s + ', coordinate precision: ' + obs[17].to_s  \
            + ', created_at ' + obs[20].to_s + ', updated_at ' + obs[21].to_s + ', time_known ' \
            + obs[22].to_s + ', created_by_dn: ' + obs[19].to_s,  #Here goes LDAP info
            :recorded_by => obs[12].to_s,
            :recorded_by_name => obs[11],
            :identified_by => '',
            :date_identified => '',
            :editor_assessment => '',
            :editor_comment => '',
            :excelfile => Object.new,
            :expedition => Object.new,
            :pictures => Array.new,
            :created => timestamp,
            :updated => timestamp,
            :created_by => Couch::Config::USER,
            :updated_by => Couch::Config::USER
         }

         #Add to occurrence remark - seals - whales -uncommon species
            alt = ['Pinnipedia', 'Phocoena phocoena', 'Lagenorhynchus spp.', 'Lagenorhynchus acutus', 'Dolphin Undetermined', 'Cetacea']
            #first check if species exist at all
            if (obs[4] != nil) && (obs[4] != '')
                elem = obs[4]
                puts @entry[:occurrence_remarks]
                puts elem
              if alt.include?(elem)
               @entry[:occurrence_remarks] += " " + elem
              end
            end

       #Finds the LDAP id - should be added to info_comment through variable temp_entry
       temp_entry = obs[19].to_s

       #Open occurences table
       oci.exec('select * from mms.occurrences where observation_id=' + obs[0].to_s) do |occu|

        # if occu[1].to_s == obs[0].to_s
           puts "Occurrence: " + occu[0].to_s + ' ' + obs[0].to_s

         #  @entry[:total] = occu[2]
          # @entry[:polar_bear_condition] = occu[5]
          # @entry[:sex] = occu[8]

           #Resolve lifestage
           case occu[4]
           when 1 #adult

            if occu[8] == 'Male'
              @entry[:adult_m] = occu[2].to_s
            elsif occu[8] == 'Female'
              @entry[:adult_f] = occu[2].to_s
            else #none
              @entry[:adult] = occu[2].to_s
            end

           when 2 #juvenile
            @entry[:sub_adult] = occu[2].to_json
           when 3 #child
            @entry[:cub_calf_pup] = occu[2].to_s
           end

           @entry[:info_comment] << ", Count accuracy: " + occu[3].to_s


       end #occurrence

       #Go through images
       y=0
       oci.exec('select * from mms.pictures where observation_id=' + obs[0].to_s) do |pic|

          puts "Picture: " + pic[0].to_s + ' ' + obs[0].to_s


          #Don't create image dir over again of more than one image
          if (y < 1)
            #Create a new dir under images and thumbnails
            Dir.mkdir 'images/' +uuid
            Dir.mkdir 'thumbnails/' + uuid
            puts uuid

            #Create thumbnail and image on apptest
            Net::SSH.start(Couch::Config::HOST2,Couch::Config::USER2, :password => Couch::Config::PASSWORD) do |ssh|
              ssh.exec "mkdir -p /srv/data.npolar.no/sighting/images/" + uuid
              ssh.exec "mkdir -p /srv/data.npolar.no/sighting/thumbnails/" + uuid
            end

            y=y+1
          end

          #Avoid cluttering up next info with old image infos from "last round".
          @pictures = Object.new
          @pictures = {
            :filename => pic[2],
            :content_type => pic[8],
            :content_size => pic[9],
            :photographer => pic[7],
            :comments => pic[4].to_s,
            :other_info => 'Created at: ' + pic[5].to_s + ', updated at: ' + pic[6].to_s
          }

          @entry[:pictures] << @pictures

          #Save the image aka blob to disk
          #Need the new id here
          File.open("images/" + uuid + '/' + pic[2], 'w') do |f|
             #Need to stringify OCI8::BLOB object
             f.write(pic[3].read)
          end

          #Convert to RMagick image object
          original = Magick::Image.read("images/"+ uuid +'/'+ pic[2]).first

          #Create thumbnail
          thumbnail = original.change_geometry('200x200') { |cols, rows, img|
             img.resize!(cols, rows)
          }

          #Save thumbnail to disk
          File.open("thumbnails/" + uuid + '/' + pic[2], 'wb') do |f|
             #Need to stringify Magick::Image object, then save to disk
             f.write(thumbnail.to_blob)
          end

          Net::SCP.start(Couch::Config::HOST2, Couch::Config::USER2, :password => Couch::Config::PASSWORD2 ) do |scp|
           puts "SCP started"
         scp.upload!("/home/siri/projects/ruby_scripts/images/" + uuid + "/" + pic[2], "/srv/data.npolar.no/sighting/images/" + uuid + "/", :recursive => true)
         scp.upload!("/home/siri/projects/ruby_scripts/thumbnails/" + uuid + "/" + pic[2], "/srv/data.npolar.no/sighting/thumbnails/" + uuid +"/", :recursive => true)
       #  scp.upload!("/home/siri/projects/ruby_scripts/excel_download", "/srv/data.npolar.no/sighting/excel_upload", :recursive => true)
         end

        end  #end oci pictures


       #Removed empty array
       if  @entry[:pictures] == [] then  @entry[:pictures] = nil end


       @expedition = Object.new

       sel = 'select * from mms.field_activities where mms.field_activities.id =
       (select mms.observations.field_activity_id from mms.observations
       where mms.observations.id =' + obs[0].to_s + ')'
       oci.exec(sel) do |field|

                puts "Field: " + field[0].to_s

                @expedition = {
                :name => field[1],
                :contact_info => field[3],
                :organisation => field[2],
                :platform => field[6],
                :platform_comment => field[7], # obs[3],
                :start_date => iso8601time(field[8]),
                :end_date => iso8601time(field[9]),
                :other_info => 'Contact person: ' + field[4] + ', email: ' + field[5]   \
                         + ', created_at: ' + field[12].to_s + ', updated_at: ' + field[13].to_s \
                         + ', created_by_dn: ' + field[10].to_s  + ', updated_by_dn: ' + field[11].to_s
                }  #end exped object

                 #Add LDAP temp variables
                 temp_expedition_created = field[10].to_s
                 temp_expedition_updated = field[11].to_s
            end

            #Avoid cluttering up next info with old excel infos
            @excelfile = Object.new

                 #Extract excelfile info
                 sel2 = 'select * from mms.obs_files where mms.obs_files.field_activity_id=
                 (select mms.observations.field_activity_id from mms.observations where
                  mms.observations.id =' + obs[0].to_s + ')'
                 oci.exec(sel2) do |ofile|

                      @excelfile = {
                         :filename => ofile[1].to_s,
                         :content_type => ofile[9].to_s,
                         :content_size => ofile[10].to_s,
                         :other_info => 'Status ' + ofile[2].to_s + ', processed_at: ' + ofile[4].to_s + \
                         ', Created at: ' + ofile[5].to_s + ', Updated at: ' + ofile[6].to_s + \
                         ', created by DN: ' + ofile[3].to_s,
                         :timestamp =>  ""      #timestamp
                      } #Excelfile

                      #Add LDAP temp variables
                      temp_excelfile = ofile[3].to_s

            end  #obs_files


#Here comes the storage into the Couch database

#Chop off so only the user uid remains -or nothing. Use LDAP to find the user by name.
    temp_entry == '' ? temp_entry = "uid=0" : temp_entry = temp_entry.split(",cn=users,dc=polarresearch,dc=org").first
    temp_expedition_created == '' ? temp_expedition_created = "uid=0" : temp_expedition_created =       temp_expedition_created.split(",cn=users,dc=polarresearch,dc=org").first
    temp_expedition_updated == '' ? temp_expedition_updated = "uid=0" : temp_expedition_updated = temp_expedition_updated.split(",cn=users,dc=polarresearch,dc=org").first
    temp_excelfile == '' ? temp_excelfile = "uid=0" : temp_excelfile = temp_excelfile.split(",cn=users,dc=polarresearch,dc=org").first


    #Connect to LDAP
    credentials = {
                    :method => :simple,
                    :username => Couch::Config::USER_LDAP,
                    :password => Couch::Config::PASSWORD_LDAP
                   }

    Net::LDAP.open(:host => Couch::Config::HOST_LDAP, :port => 389, :base => "dc=polarresearch, dc=org", :auth => credentials ) do |ldap|

          #Add results from LDAP search into @entry
          ldap.search(filter: temp_entry, base: "dc=polarresearch,dc=org", ignore_server_caps: true) do |ldap_entry|
              # puts ldap_entry.cn #common name
              # puts ldap_entry.sn
              # puts ldap_entry.dn
              # puts ldap_entry.givenName
              # puts ldap_entry.mail
                e0 = (ldap_entry.cn.first.to_s).force_encoding('iso-8859-1').encode('utf-8')
               @entry[:info_comment ] << ', created_by_dn: ' + e0 + ', ' + (ldap_entry.mail).first.to_s
          end

          #Expedition - add from LDAP search
          ldap.search(filter: temp_expedition_created, base: "dc=polarresearch,dc=org", ignore_server_caps: true) do |ldap_entry1|
               puts ldap_entry1.cn
             #  puts ldap_entry1.mail
                e1 = (ldap_entry1.cn.first.to_s).force_encoding('iso-8859-1').encode('utf-8')
               @expedition[:other_info] << ', created_by_dn: ' + e1 + ', ' + (ldap_entry1.mail).first.to_s
          end

          #Expedition variable created and updated
          ldap.search(filter: temp_expedition_updated, base: "dc=polarresearch,dc=org", ignore_server_caps: true) do |ldap_entry2|
               puts ldap_entry2.cn
             #  puts ldap_entry2.mail
                e2 = (ldap_entry2.cn.first.to_s).force_encoding('iso-8859-1').encode('utf-8')
                @expedition[:other_info] << ', updated_by_dn: ' + e2 + ', ' + (ldap_entry2.mail).first.to_s
          end

          #Excelfile - add from LDAP search
          ldap.search(filter: temp_excelfile, base: "dc=polarresearch,dc=org", ignore_server_caps: true) do |ldap_entry3|
               puts ldap_entry3.cn #common name
             #  puts ldap_entry3.mail
               e3 = (ldap_entry3.cn.first.to_s).force_encoding('iso-8859-1').encode('utf-8')
               @excelfile[:other_info] << (', created by DN: ' + e3 + ', ' + (ldap_entry3.mail).first.to_s).force_encoding('iso-8859-1').encode('utf-8')
          end
    end


    #Add expedition and excelfile objects to entry object
    defined?(@expedition[:other_info]).nil? ? @entry[:expedition] = nil : @entry[:expedition] = @expedition
    defined?(@excelfile[:file_name]).nil? ?  @entry[:excelfile] = nil : @entry[:excelfile] = @excelfile


    #Post coursetype
    doc = @entry.to_json

    res = server.post("/"+ Couch::Config::COUCH_DB_NAME + "/", doc, Couch::Config::USER, Couch::Config::PASSWORD)


     #Load only the x first entries
   #  x += 1
   #  if x==2 then break end;



 end #observation -need to keep the object until stored

end #class
end #module
