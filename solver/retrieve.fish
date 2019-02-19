#!/bin/fish

# 2017, 2018, 2019, ...
set year 2019

# 0=Winter, 1=Spring, 7=Summer 9=Fall
set term 1

# NB, ONLINE_NB, NK, ONLINE_NK, CM, ONLINE_CM, D, J, WM, E, H, AC, B, CC, MC, RV
set campus NB

set endpoints courses openSections

set api "sis.rutgers.edu/soc"
set query "?year=$year&term=$term&campus=$campus"

mkdir -p ./data
for endpoint in $endpoints;
    set -l file "./data/$year-$term-$campus-$endpoint.json"
    set -l url "$api/$endpoint.gz$query"
    curl $url -o $file --compressed
end
