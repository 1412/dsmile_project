dsmile_project
==============

## Installing


### Requirement
 * git (lastest)
 * nodejs (ver 0.10 or higher)
 * mysql / mariadb (lastest)

###Cloning
clone project with terminal:
```
git clone https://github.com/1412/dsmile_project.git dsmile
cd dsmile
npm install -d
```

###Updating
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

###Using forever
it is recomended to run using forever to avoid dead server

install forever with terminal
```
npm install forever forever-monitor -g
cd dsmile
forever index.js
```


