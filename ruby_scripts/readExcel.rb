#!/usr/bin/env ruby
# Convert from the incoming mms Excel files to the new sightings database
#
# Author: srldl
#
########################################

require './config'
require './server'
require 'net/http'
require 'net/ssh'
require 'net/scp'
require 'mdb'
require 'time'
require 'date'
require 'json'
require 'oci8'
require 'net-ldap'
require 'rmagick'
require 'spreadsheet'



module Couch

  class ReadExcel

    #Fetch a file name from the directory
    #Convert to iso8601
    def self.iso8601time(inputdate)
       a = (inputdate).to_s
       b = a.split(" ")
       c = b[0].split("-")
       dt = DateTime.new(c[0].to_i, c[1].to_i, c[2].to_i, 12, 0, 0, 0)
       return dt.to_time.utc.iso8601
    end

    #Open the file
    Spreadsheet.client_encoding = 'UTF-8'
    filename = 'SR1-2014.xls'
    Spreadsheet.open('./excel_download2/' + filename) do |book|
     # book.worksheet('Sightings').each do |row|
     sheet1 = book.worksheet('Sightings')

       puts "start"


       #Get ready to put into database
       server = Couch::Server.new(Couch::Config::HOST1, Couch::Config::PORT1)


       #Fetch a UUID from couchdb
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
            :event_date => iso8601time(sheet1.rows[18][0]),
            :locality => sheet1.rows[18][3],
            :latitude => (sheet1.rows[18][1]).to_f(),    #Big decimal
            :longitude => (sheet1.rows[18][2]).to_f(),   #Big decimal
            :species => (sheet1.rows[18][4]),
            :adult_m => (sheet1.rows[18][5]).to_i,
            :adult_f => (sheet1.rows[18][6]).to_i,
            :adult => (sheet1.rows[18][7]).to_i,
            :sub_adult => (sheet1.rows[18][8]).to_i,
            :polar_bear_condition => (sheet1.rows[18][9]),
            :cub_calf_pup => (sheet1.rows[18][10]).to_i,
            :bear_cubs => (sheet1.rows[18][11]).to_i,
            :unidentified => (sheet1.rows[18][12]).to_i,
            :dead_alive => (sheet1.rows[18][13]),
            :total => (sheet1.rows[18][14]),
            :habitat => (sheet1.rows[18][15]),
            :occurrence_remarks => (sheet1.rows[18][16]),
            :recorded_by => sheet1.rows[1][10],
            :recorded_by_name => sheet1.rows[0][10],
            :excelfile => Object.new,
            :expedition => Object.new,
            :created => timestamp,
            :updated => timestamp,
            :created_by => Couch::Config::USER,
            :updated_by => Couch::Config::USER
         }


        @expedition = Object.new
        @expedition = {
                :name => sheet1.rows[0][10],
                :contact_info => sheet1.rows[1][10],
                :organisation => sheet1.rows[2][10],
                :platform => sheet1.rows[5][10],
                #:platform_comment => ,
                :start_date => iso8601time(sheet1.rows[3][10]),
                :end_date => iso8601time(sheet1.rows[4][10])
                }  #end exped object


        #Avoid cluttering up next info with old excel infos
        @excelfile = Object.new

        #Extract excelfile info
        @excelfile = {
                  :filename => filename,
                  :content_type => filename, #last digits
                  :content_size => filename, #size
                  :timestamp =>  ""      #timestamp
        } #Excelfile


    #Add expedition and excelfile objects to entry object
    defined?(@expedition[:name]).nil? ? @entry[:expedition] = nil : @entry[:expedition] = @expedition
    defined?(@excelfile[:filename]).nil? ?  @entry[:excelfile] = nil : @entry[:excelfile] = @excelfile


puts @entry
#save entry in database

end #entry

end #class
end #module
