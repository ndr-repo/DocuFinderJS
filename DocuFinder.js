javascript:
input = prompt("Enter the target domain");
pdf=("https://www.google.com/search?q=(filetype:pdf+%7C+ext:pdf)+site:*.")+input+("&filter=0");
pdfDdg=("https://duckduckgo.com/?q=filetype%3Apdf+site%3A")+input;
ppt=("https://www.google.com/search?q=(filetype:ppt+%7C+ext:ppt+%7C+filetype:pptx+%7C+ext:pptx)+site:*.")+input+("&filter=0");
pptDdg=("https://duckduckgo.com/?q=filetype%3Appt+site%3A")+input;
docx=("https://www.google.com/search?q=(filetype:doc+%7C+ext:doc+%7C+filetype:docx+%7C+ext:docx)+site:*.")+input+("&filter=0");
docDdg=("https://duckduckgo.com/?q=filetype%3Adoc+site%3A")+input;
xlsx=("https://www.google.com/search?q=(filetype:xlsx+%7C+ext:xlsx+%7C+filetype:xls+%7C+ext:xls+%7C+filetype:csv+%7C+ext:csv)+site:*.")+input+("&filter=0");
xlsDdg=("https://duckduckgo.com/?q=filetype%3Axls+site%3A")+input;
function GetDocs(){ window.open(pdf); window.open(pdfDdg); window.open(ppt); window.open(pptDdg); window.open(docx); window.open(docDdg); window.open(xlsx); window.open(xlsDdg);};        GetDocs()
     // discoveryOpsJS: DocuFinder // Created by Gabriel H. @weekndr_sec // Respect to @WebBreacher, @K2SOsint, & @hatless1der