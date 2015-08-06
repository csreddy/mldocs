declare namespace a="http://marklogic.com/xdmp/apidoc";
 
 (:  this funtions need to be fixed :)  
declare function local:serialize($xml as node(), $ele-name as xs:string){
let $log := xdmp:log($xml)
 let $nodes := $xml/node()
for $node in $nodes
let $tag-name := $node/node-name()
let $desc := if(fn:empty($tag-name)) then 
                 normalize-space(fn:string($node)) 
              else (
              let $has-child := fn:count($node/*)
              let $log := xdmp:log($has-child)
              return (
                    if ($has-child gt 0) then 
                        local:serialize($node, fn:string($tag-name)) 
                    else if (fn:string-length($ele-name)  gt 0) then    
                        fn:concat("<", $ele-name, ">", "<", $tag-name, ">", normalize-space($node/text()), "</", $tag-name, ">", "</", $ele-name, ">")
                    else 
                        fn:concat("<", $tag-name, ">", normalize-space($node/text()), "</", $tag-name, ">")
                     )
                     )
               
  return $desc
};    


   let $files := xdmp:filesystem-directory("/Users/sreddy/space/MarkLogic_8_pubs/pubs/raw/apidoc/")/*:entry
     let $paths :=  for $file in $files
                    return if($file/*:type/text() eq 'file' 
                    and $file/*:filename/text() ne 'MANAGE'
                    and $file/*:filename/text() ne 'REST-CLIENT'
                    and $file/*:filename/text() ne 'PACKAGE') then  $file/*:pathname/text() else ()
      for $path in $paths              
      let $xml := xdmp:unquote(xdmp:filesystem-file($path))
      let $module := $xml/a:module
      let $module-name := $module/@name
      
      let $functions := $module/*:function
      for $f in $functions
      let $api-name := $f/@name
      let $class := $f/@class
      
      
      let $log := xdmp:log($module-name)
      let $log := xdmp:log($api-name)
      
      let $lib := $f/@lib
      let $bucket := $f/@bucket
      let $bucket := if(fn:empty($bucket)) then "none" else text {$bucket}
      let $category := $f/@category
      let $category := if(fn:empty($category)) then "" else text {$category}
      let $summary := $f/a:summary
      let $params := 
            for $p in $f/a:params/*
            let $name := text {$p/@name}
            let $name := if(fn:empty($name)) then "" else text {$name}
            let $type := text {$p/@type}
            let $type := if(fn:empty($type)) then "" else text {$type}
            let $required := if(fn:not(fn:empty($p/@optional/text()))) then boolean-node {fn:not($p/@optional)} else fn:true()
            let $desc := text {$p}
            return object-node{
            "name": $name,
            "type": $type,
            "required": $required,
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
                "apiName": text {$api-name},
                "lib": text {$lib},
                "category": text {$category},
                "bucket": text {$bucket},
                "summary": text {$summary},
                "params": array-node {$params},
                "return": text {$return},
                "usage": $usage,
                "examples": $examples
                } 
        let $uri :=  if(fn:empty($class)) then 
                            fn:concat("/", $lib, "/", $api-name, ".json")
                           else fn:concat("/", $lib, "/", $class, "/", $api-name, ".json")

         let $collections := if(fn:not(fn:empty($bucket))) then
                         ("docs", $lib, $bucket) 
                         else   ("docs", $lib)
             return xdmp:document-insert($uri, $api, (), $collections)  
            