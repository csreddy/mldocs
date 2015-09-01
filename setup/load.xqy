declare namespace a="http://marklogic.com/xdmp/apidoc";
   let $files := xdmp:filesystem-directory("/Users/sreddy/space/angularjs/mldocs/setup/apidoc")/*:entry
     let $paths :=  for $file in $files
                    return if($file/*:type/text() eq 'file' 
                    and $file/*:filename/text() ne '.DS_Store'
                   ) then  $file/*:pathname/text() else ()
      for $path in $paths              
      let $xml := xdmp:unquote(xdmp:filesystem-file($path))
      let $module := $xml/a:module
      let $module-name := $module/@name
      
      let $functions := $module/*:function
      for $f in $functions
      let $api-name := $f/@name
      let $class := $f/@class
      
      (:
      let $log := xdmp:log($module-name)
      let $log := xdmp:log($api-name)
      :)
      
      let $lib := $f/@lib
      let $http-verb := $f/@http-verb
      let $http-verb := if(fn:empty($http-verb)) then "" else text {$http-verb}
      let $isRest := if(data($http-verb) ne "") then fn:true() else  fn:false()
      let $bucket := $f/@bucket
      let $bucket := if(fn:empty($bucket)) then "none" else text {$bucket}
      let $category := $f/@category
      let $category := if(fn:empty($category)) then "" else text {$category}
      let $subcategory := $f/@subcategory
      let $subcategory := if(fn:empty($subcategory)) then "" else text {$subcategory}
      let $summary := $f/a:summary
       let $params := 
            for $p in $f/a:params/*
            let $name := text {$p/@name}
            let $name := if(fn:empty($name)) then "" else text {$name}
            let $type := text {$p/@type}
            let $type := if(fn:empty($type)) then "" else text {$type}
            let $required := fn:not($p/@optional/data())
            let $desc := text {$p}
            return object-node{
            "name": $name,
            "type": $type,
            "description":$desc,
            "required": $required
            }
         let $headers := 
            for $p in $f/a:headers/*
            let $name := text {$p/@name}
            let $name := if(fn:empty($name)) then "" else text {$name}
            let $type := text {$p/@type}
            let $type := if(fn:empty($type)) then "" else text {$type}
            let $desc := text {$p}
            return object-node{
            "name": $name,
            "type": $type, 
            "description":$desc
            }    
      let $return := $f/a:return 
      let $return := if(fn:empty($return)) then "" else text {$return}
      let $usage := $f/a:usage
      let $usage := if(fn:empty($usage)) then "" else text {$usage}
     
     let $examples := for $e in $f/a:example
                    return text {$e}
     let $examples := if(fn:empty($examples)) then "" else array-node {$examples}
      let $api := object-node {
                "isRest": $isRest,
                "apiName": text {$api-name},
                "http-verb": text {$http-verb},
                "lib": text {$lib},
                "category": text {$category},
                "subcategory": text{$subcategory},
                "bucket": text {$bucket},
                "summary": text {$summary},
                "params": array-node {$params},
                "headers": array-node {$headers},
                "return": text {$return},
                "usage": $usage,
                "examples": $examples
                } 
        let $uri :=  if(fn:empty($class)) then 
                            if(fn:not(fn:empty($http-verb))) then 
                                     fn:concat("/", $lib, "/", $http-verb, $api-name, ".json")
                                   else 
                                       fn:concat("/", $lib, "/", $api-name, ".json")
                           else fn:concat("/", $lib, "/", $class, "/", $api-name, ".json")

         let $collections := if(fn:not(fn:empty($bucket))) then
                         ("docs", $lib, $bucket) 
                         else   ("docs", $lib)
             return xdmp:document-insert(xdmp:url-encode($uri), $api, (), $collections)  
           (: return $uri :)
            