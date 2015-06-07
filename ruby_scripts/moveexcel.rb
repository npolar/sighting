#!/usr/bin/env ruby
# Convert from the old mms database Excel sheet to the new sightings database
#
# Author: srldl
#
########################################

require './server'
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

    #Host1 is the database server
    host1 = 
    port1  = "5984"
    user = 
    password = 

    #Host2 is the file server
    host2 = 
    user2 = 
    password2 =

    #LDAP_host is the LDAP server
    host_ldap = 
    user_ldap = 
    password_ldap =


    #Old mms info about database
    user_mms = 
    password_mms = 
    oracle_sid = 

    #Couch database name
    couch_db_name = "sighting"


    #Get Oracle server connection
    #Get caroline.npolar.no
    oci = OCI8.new(user_mms,password_mms,oracle_sid)

    #Get ready to put into database
    server = Couch::Server.new(host1, port1)


    #Fetch observation info
    oci.exec('select * from mms.obs_files') do |ofile|

        #Move to disk
        File.open("excel_download/"+ofile[1], 'w') do |f|
                f.write((ofile[8]).read)
        end

        #Copy to apptest
        Net::SCP.start(host2, user2, :password => password2 ) do |scp|
         puts "SCP started"
         scp.upload!("/home/siri/projects/ruby_scripts/excel_download", "/srv/data.npolar.no/sighting/excel_download", :recursive => true)
        end


    end

end
end



