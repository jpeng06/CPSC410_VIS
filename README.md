# CPSC410_VIS
UBC CPSC 410 Visualization Project


Syntactic and lexical analysis tool that displays nodes based on individual function size as well as linkages between nodes based on function calls.

## Goal
Provide an intuitive way for project manager or developer to get a sense of the size of project. So that they would know when the code should be refactored. In additional to this, developers would be able to check how the code changes throughout the time.

![sys](https://github.com/jpeng06/CPSC410_VIS/blob/master/images/sys.png "sys")

## Fetch
User needs to provide a link to Java repo first before the code analysis is taking place. 

```javascript
node gitCrawler github.com/XXXXXXXXXX 50
```
- the first paramter is the link to the Java repo you would like to visualize
- the second paramter is the limit for number of commits you would like to fetch

## Parsing and Analyzing

The parsing will be commencing once fetching is finished. Parsing will be looking for funtion names and number of lines in each function, then generating json file in the format that would be required for visualization.

each json output file would be generated in ```output``` folder and file name would be the date of each commit. 

## Notice
Noticing that this repo doesn't have a server right now, so you have to manually entrethe name of json files you would like to be anlysized. Simply put the name in the ```names``` json located in ```Script/sliderBar.js```.

## Demo

![demo](https://github.com/jpeng06/CPSC410_VIS/blob/master/images/Screen%20Shot%202018-11-27%20at%207.23.05%20PM.png "Demo")

### Node
- eahc function is represented by node and its size represents the size of each function or the nmber of lines.
- the link indicated the function calls 


<hr>
2018 © All Rights Reserved
