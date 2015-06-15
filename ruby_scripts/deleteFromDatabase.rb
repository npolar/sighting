#!/usr/bin/env ruby
#
# This programme deletes all entries from a named couch database
# Handy when you want to clear everything.
#
# Author: srldl
#################################################################

require './server'
require 'net/http'


module Couchdb
  
  class DeleteEntries

    host = "dbtest.data.npolar.no"
    port  = "5984"
    database = "sighting"


    #Get ready to put into database
    server = Couch::Server.new(host, port)

    #Fetch a UUIDs from courchdb
    res = server.get("/"+ database +"/_all_docs")
    
    #Get the UUIDS
    str = (res.body).tr('"','')

    #Need id
    id = str.split('id:')

    #Need revision
    rev = str.split('rev:')

    #Delete all entries
    (id).each_with_index { |r, i|
        puts r[0,36] + '  ' + (rev[i])[0,34]
        if i > 0
          server.delete(("/" + database + "/" + r[0,36]).to_s + "?rev=" + (rev[i])[0,34])
        end
     }


  end
end
    
