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

###Setup
 * login to mysql as root
 * import sql.sql file
 * edit config.js, to match your configuration

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

###Updating
