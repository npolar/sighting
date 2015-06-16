#!/usr/bin/env ruby
# Convert from the incoming mms Excel files to the new sightings database
#
# Author: srldl
#
# Requirements: At least one of the three fields lat, lon or event_date must be filled in
# for the script to work.
#
########################################

require './config'
require './server'
require 'net/http'
require 'net/ssh'
require 'net/scp'
require 'time'
require 'date'
require 'json'
require 'oci8'
require 'net-ldap'
require 'rmagick'
require 'simple-spreadsheet'



module Couch

  class ReadExcel

    #Get hold of UUID for database storage
    def self.getUUID(server)

      #Fetch a UUID from couchdb
       res = server.get("/_uuids")


       #Extract the UUID from reply
       uuid = (res.body).split('"')[3]

       #Convert UUID to RFC UUID
       uuid.insert 8, "-"
       uuid.insert 13, "-"
       uuid.insert 18, "-"
       uuid.insert 23, "-"
       return uuid
    end

    #Get a timestamp - current time
    def self.timestamp()
       a = (Time.now).to_s
       b = a.split(" ")
       c = b[0].split("-")
       dt = DateTime.new(c[0].to_i, c[1].to_i, c[2].to_i, 12, 0, 0, 0)
       return dt.to_time.utc.iso8601
    end


    #Get date, convert to iso8601
    #Does not handle chars as month such as 6.june 2015 etc
    #Does not handle day in the middle, such as 04/23/2014 etc
    def self.iso8601time(inputdate)
       a = (inputdate).to_s
       puts "a " + a

       #Delimiter space, -, .,/
       b = a.split(/\.|\s|\/|-/)
       #Find out where the four digit is, aka year
       if b[0].size == 4 #Assume YYYY.MM.DD
             dt = DateTime.new(b[0].to_i, b[1].to_i, b[2].to_i, 12, 0, 0, 0)
       elsif b[2].size == 4  #Assume DD.MM.YYYY
             dt = DateTime.new(b[2].to_i, b[1].to_i, b[0].to_i, 12, 0, 0, 0)
       else
             puts "cannot read dateformat"
       end
             return dt.to_time.utc.iso8601
    end


    species = {'Polar Bear' => 'ursus maritimus',
              'Polar bear Den' => 'ursus maritimus den',
              'Walrus' => 'odobenus rosmarus',
              'Ringed Seal' => 'pusa hispida',
              'Bearded Seal' => 'erignathus barbatus',
              'Harbour Seal' => 'phoca vitulina',
              'Harp Seal' => 'phoca groenlandica',
              'Hooded Seal' => 'cystophora cristata',
              'Seal'=>'pinnipedia',
              'Bowhead Whale' => 'balaena mysticetus',
              'White Whale' => 'delphinapterus leucas',
              'Narwhal' => 'monodon monoceros',
              'Blue Whale' => 'balaenoptera musculus',
              'Fin Whale' => 'balaenoptera physalus',
              'Humpback whale' => 'megaptera novaeangliae',
              'Minke Whale' => 'balaenoptera acutorostrata',
              'Sei Whale' => 'balaenoptera borealis',
              'Sperm Whale' => 'physeter macrocephalus',
              'Northern Bottlenose Whale' =>'hyperoodon ampullatus',
              'Killer Whale' => 'orcinus orca',
              'Pilot Whale' => 'globicephala melas',
              'Atlantic White-sided Dolphin' => 'lagenorhynchus acutus',
              'White-beaked Dolphin' => 'lagenorhynchus albirostris',
              'Harbour Porpoise' => 'phocoena phocoena',
              'Whale' => 'cetacea',
              'Other species' =>'unknown'}

    # do work on files ending in .xls in the desired directory
    Dir.glob('./excel_download2/*.xls*') do |excel_file|

     puts excel_file

     #Get filename -last part of array (path is the first)
     filename =  excel_file[18..-1]


     #Open the file
     s = SimpleSpreadsheet::Workbook.read(excel_file)

     #Always fetch the first sheet
     s.selected_sheet = s.sheets.first

     #Start down the form -after
     line = 19
     while (line > 18 and line < (s.last_row).to_i)

          #if row hasn't got event_date, lat or lon, skip it
          unless ((s.cell(line,1)== nil) or (s.cell(line,1) == "Add your observations here:") or (s.cell(line,1)==' ')) \
          and ((s.cell(line,2)==nil) or (s.cell(line,2).to_i)==0 or (s.cell(line,2).to_s) =='') \
          and ((s.cell(line,3)==nil) or (s.cell(line,3).to_i)==0 or (s.cell(line,3).to_s) =='')


              #Total is an object --but some people use integer or Fixnum instead..
              if (s.cell(line,15) != "") and (s.cell(line,15).class == Object)
                    total = (((s.cell(line,15)).value).to_i).to_s
              else  #But some users fix it to be Fixnum or integer..
                    total = (s.cell(line,15)).to_i.to_s
              end

              #Read the row here
              #Get ready to put into database
              server = Couch::Server.new(Couch::Config::HOST1, Couch::Config::PORT1)

              #Get uuid
              uuid = getUUID(server)


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
                :event_date => (if (s.cell(line,1)) then iso8601time(s.cell(line,1)) end),
                :locality => (s.cell(line,4)) == "(select or write placename)"? "": (s.cell(line,4)),
                :latitude => (s.cell(line,2)).to_f(),    #Not big decimal
                :longitude => (s.cell(line,3)).to_f(),   #Not big decimal
                :species => (s.cell(line,5)) == "(select species)"? "": species[(s.cell(line,5))],
                :adult_m => ((s.cell(line,6)).to_i).to_s,
                :adult_f => ((s.cell(line,7)).to_i).to_s,
                :adult => (s.cell(line,8).to_i).to_s,
                :sub_adult => ((s.cell(line,9)).to_i).to_s,
                :polar_bear_condition => ((s.cell(line,10)) == "(select condition)")? "":((s.cell(line,10)).to_i).to_s,
                :cub_calf_pup => ((s.cell(line,11)).to_i).to_s,
                :bear_cubs => (s.cell(line,12)) == "(select years)"? "": ((s.cell(line,12)).to_i).to_s,
                :unidentified => (s.cell(line,13).to_i).to_s,
                :dead_alive => (s.cell(line,14)),
                :total => total,
                :habitat => (s.cell(line,16)) == "(select habitat)"? "": (s.cell(line,16)),
                :occurrence_remarks => (s.cell(line,17)),
                :recorded_by => s.cell(3,11),
                :recorded_by_name => s.cell(2,11),
                :excelfile => Object.new,
                :expedition => Object.new,
                :created => timestamp,
                :updated => timestamp,
                :created_by => Couch::Config::USER,
                :updated_by => Couch::Config::USER
            }

            #Extract expedition info
            @expedition = Object.new
            @expedition = {
                :name => s.cell(2,11),
                :contact_info => s.cell(3,11),
                :organisation => s.cell(4,11),
                :platform => s.cell(7,11),
                :start_date => (if s.cell(5,11) then iso8601time(s.cell(5,11)) end),
                :end_date => (if s.cell(6,11) then iso8601time(s.cell(6,11)) end)
                }  #end exped object

            #Extract excelfile info
            @excelfile = Object.new
            @excelfile = {
                  :filename => filename,
                  :content_type => "application/vnd.ms-excel", #last digits
                  :content_size => (File.size(excel_file)).to_s, #size
                  :timestamp =>  ""      #timestamp
            } #Excelfile


            #Add expedition and excelfile objects to entry object
            defined?(@expedition[:name]).nil? ? @entry[:expedition] = nil : @entry[:expedition] = @expedition
            defined?(@excelfile[:filename]).nil? ?  @entry[:excelfile] = nil : @entry[:excelfile] = @excelfile

            puts @entry

            #save entry in database
            doc = @entry.to_json
            res = server.post("/"+ Couch::Config::COUCH_DB_NAME + "/", doc, Couch::Config::USER, Couch::Config::PASSWORD)



          end #unless nil

          #Count up next line
          line += 1
     end #while line

     #Move Excel file to 'done'
     File.rename excel_file, (excel_file[0..17]+'done/' + filename)
  end #file

  end
end