### **ML Docs**<sup>_lite_</sup>

[MarkLogic](http://www.marklogic.com/) has over 3000 apis, its very hard to quicky and accurately find the api you are looking for. More often than not you just want to lookup the api, learn about it and get back to work.
**ML Docs**<sup>_lite_</sup> is light weight and clean interface, that’ll enable you to quickly and accurately locate the api at lightning speed, whether you are online or __offline!__

#####highlights

+ Offline search, the user can save the docs for later usage to access, even when they are on a plane or inside a cave!
+ Clean interface to quickly find the api you are looking for instead of using docs.marklogic.com which is often too slow and does event return the correct results sometimes
+ Using fuzzy search,  you don’t need to type exact names, it will help narrow down the results as you type


#### Setup
 + Import the setup package under `setup` dir db-server-setup-pkg.zip. This will setup the database and the app server required for the app
 + Run the script `load.xqy` in QConsole. This script transforms xml apidocs into json and injects in `mldocs` database.  
   ######Note:before you execute the script
   - Make sure set the content source to `mldocs`. 
   - Make sure to change the path in the script to apidocs (`/setup/apidoc`) dir on your filesystem before you execute

   ![mldocs](homepage.png?raw=true "App home page")
