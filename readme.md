# Simple demo to show where the mobile towers are

Mini demo to show data around mobile cell towers in the uk. At the moment,
it's pretty basic with an input for putting in coords, map showing data points and
a table with the data.

more ideas/ to do:
------------------
- lasso tool for selecting area of interest
- make the querires more scalable (e.g. at the moment if you define too big an area it dumps tens of MB of data into the browser)
(can do this via ajax datatables, only sending limited fields, possible backend map rendering)
- more dataviz around e.g. which operator has most towers (from DB I know that it's EE)
, confidences, and which towers have the most reported users -- presumably these are more 'important' then the very infrequently used ones?
- where is your nearest tower? (with geolocation apis/ voronoi)
- tweak tooltip? (perhaps with voronoi mouse event if possible...)
- tweak map styling?
- tidy up the file structure
- look into experimenting with reactjs
- error handling

## File structure
```
    - package.json (for required node modules) + package-lock.json
    - index.js (node)
    - routes.js (node -- for defining api endpoints)
    - api (node, folder for files that define api routes, 1 file per route)
    - pgDB (for connecting to postgres DB with the data, -- pgConfig for credentials *remember to update with your own configs and save as pgConfig.js!)
    -public (front end files-- basic html and js for now)
```

## Running instructions:
1. save a copy of `pgConfig.example.js` as `pgCongig.js`, filling in the placeholder values with your database credentials
2. run `npm install` in root directory
3. run `node index.js` in root directory
4. at this point node server should be running on port 3000
5. navigate to `localhost:3000` on your browser and you should be good to go
6. please use a modern browser... (one that supports webgl)
