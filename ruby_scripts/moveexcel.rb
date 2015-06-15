#!/usr/bin/env ruby
# Move images from local harddisk to apptest (or master).
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

  class MoveExcel

    #Get Oracle server connection
    #Get caroline.npolar.no
    oci = OCI8.new(Couch::Config::USER_MMS,Couch::Config::PASSWORD_MMS,Couch::Config::ORACLE_SID)

    #Get ready to put into database
    server = Couch::Server.new(Couch::Config::HOST1, Couch::Config::PORT1)


    #Fetch observation info
    oci.exec('select * from mms.obs_files') do |ofile|

        #Move to disk
        File.open("excel_download/"+ofile[1], 'w') do |f|
                f.write((ofile[8]).read)
        end

        #Copy to apptest
        Net::SCP.start(Couch::Config::HOST2, Couch::Config::USER2, :password => Couch::Config::PASSWORD2 ) do |scp|
         puts "SCP started"
         scp.upload!("/home/siri/projects/ruby_scripts/excel_download", "/srv/data.npolar.no/sighting/excel_download", :recursive => true)
        end


    end

end
end



