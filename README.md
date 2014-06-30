dsmile_project
==============

## Installing


### Requirement
 * git (lastest)
 * nodejs (ver 0.10 or higher)
 * mysql / mariadb (lastest)

###Clone from git
clone project with terminal:
```
git clone https://github.com/1412/dsmile_project.git dsmile
cd dsmile
npm install -d
```

###Updating
update by terminal
```
cd dsmile
git pull
npm install -d
```

###Setup
 * edit config.json, to match your configuration
 * login to mysql as root
 * create user, and database match to your configuration

###Running
run program with terminal
```
cd dsmile
node .
```
or
```
cd dsmile
npm start
```

###Using forever
it is recomended to run using forever to avoid dead server

install forever with terminal
```
npm install forever forever-monitor -g
cd dsmile
forever index.js
```

## To Do

1. Start build interface and server API

## Documentation



## Tests




## Contribution

You are welcome to contribute by writing issues or pull requests.
It would be nice if you open source your own loaders or webmodules. :)

You are also welcome to correct any spelling mistakes or any language issues, because my english is not perfect...


## License

Copyright (c) 2012-2013 Tobias Koppers

MIT (http://www.opensource.org/licenses/mit-license.php)

