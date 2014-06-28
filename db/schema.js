function MergeJSON(target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}

var SEQUELIZE = require('sequelize');
var DB = {};
DB.Client = new SEQUELIZE('clinic', 'clinicuser', '1234', {
	host: 'localhost',
  	port: 3306,
 	protocol: 'tcp',
  
  	// disable logging; default: console.log
	logging: false,
 
	// the sql dialect of the database
	// - default is 'mysql'
	// - currently supported: 'mysql', 'sqlite', 'postgres', 'mariadb'
 	dialect: 'mysql',
 
	// disable inserting undefined values as NULL
	// - default: false
	omitNull: true,
  
	// Specify options, which are used when sequelize.define is called.
	// The following example:
	//   define: {timestamps: false}
	// is basically the same as:
	//   sequelize.define(name, attributes, { timestamps: false })
	// so defining the timestamps for each model will be not necessary
	// Below you can see the possible keys for settings. All of them are explained on this page
	define: {
  		// underscored: false
  		// freezeTableName: false,
  		syncOnAssociation: true,
  		charset: 'utf8',
  		collate: 'utf8_general_ci',
  		timestamps: true
	},
 
	// similiar for sync: you can define this to always force sync for models
	sync: { force: false },
 
	// sync after each association (see below). If set to false, you need to sync manually after setting all associations. Default: true
	syncOnAssociation: true,
 
	// language is used to determine how to translate words into singular or plural form based on the [lingo project](https://github.com/visionmedia/lingo)
	// options are: en [default], es
	language: 'en'
});
	
/* Define Schema */
DB.__version = 1.0;
	
DB.ApplicationInfo = DB.Client.define('ApplicationInfo', {
    name: SEQUELIZE.STRING(100),
    version: SEQUELIZE.FLOAT(3),
    schemaVersion: SEQUELIZE.FLOAT(3),
    owner: SEQUELIZE.STRING(100),
    address: SEQUELIZE.STRING,
    note: SEQUELIZE.STRING(100)
});

DB.UserRole = DB.Client.define('UserRole', {
    title: SEQUELIZE.STRING(100),
    description: SEQUELIZE.TEXT,
    note: SEQUELIZE.STRING(100)
}, {
	getterMethods   : {
		privilegesFlat: function(){
    		var privileges = this.privileges;
    		var result = [];
			for (i in privileges) {
				result.push(privileges[i].title);
			}
			return result;
		},
		hasPrivilige: function(privilege){
			return (this.privilegesFlat.indexOf(privilege) > -1);
		}
	}
});

DB.Privilege = DB.Client.define('Privilege', {
    title: SEQUELIZE.STRING(50),
    note: SEQUELIZE.STRING(100)
});

DB.User = DB.Client.define('User', {
    username: SEQUELIZE.STRING(100),
    password: SEQUELIZE.STRING(35),
    enabled: SEQUELIZE.BOOLEAN,
    email: SEQUELIZE.STRING(100),
    note: SEQUELIZE.STRING(100)
}, {
	getterMethods   : {
		role: function(){
			return this.userRole.title;
		},
    	privilegesFlat: function(){
    		return this.userRole.privilegesFlat;
		},
		hasPrivilige: function(privilege){
			return (this.privilegesFlat.indexOf(privilege) > -1);
		},
    	isDoctor: function(){
    		if (this.doctor === undefined) {
    			return false;
    		}
    		if (this.doctor == null) {
    			return false;
    		}
    		return true
    	},
    	flatData: function(){
    		var result = {
    			username: this.username,
   				password: this.password,
    			email: this.email,
    			isDoctor: this.isDoctor,
    			role: this.role,
    			privileges: this.privilegesFlat
    		};
    		if (this.isDoctor) {
    			var data = this.doctor;
    			var doctordata = {
    				name: data.name,
    				degree: data.degree,
    				phone: data.phone,
    				address: data.address,
    				email: data.email,
    				gender: data.gender
    			}
    			result = MergeJSON(result, doctordata);
    		}
    		return result;
    	}
  	},
});

DB.Doctor = DB.Client.define('Doctor', {
    name: SEQUELIZE.STRING(100),
    degree: SEQUELIZE.STRING(50),
    phone: SEQUELIZE.STRING(20),
    address: SEQUELIZE.STRING,
    email: SEQUELIZE.STRING(100),
    gender: SEQUELIZE.ENUM('L', 'P', 'O'),
    birthDate: SEQUELIZE.DATE,
    birthPlace: SEQUELIZE.STRING(100),
    note: SEQUELIZE.STRING(100)
});

DB.Patient = DB.Client.define('Patient', {
    name: SEQUELIZE.STRING(100),
    gender: SEQUELIZE.ENUM('L', 'P', 'O'),
    birthDate: SEQUELIZE.DATE,
    birthPlace: SEQUELIZE.STRING(100),
    jobs: SEQUELIZE.STRING(100),
    specialCondition: SEQUELIZE.STRING(100),
    alergic: SEQUELIZE.STRING(100),
    note: SEQUELIZE.STRING(100),
});

DB.PatientTreatment = DB.Client.define('PatientTreatment', {
    start: SEQUELIZE.DATE,
    finish: SEQUELIZE.DATE,
    diagnose: SEQUELIZE.STRING(100),
    therapy: SEQUELIZE.STRING(100),
    presumption: SEQUELIZE.STRING(100),
    discon: SEQUELIZE.INTEGER,
    charge: SEQUELIZE.INTEGER,
    payment: SEQUELIZE.INTEGER,
    paymentMethod: SEQUELIZE.STRING(20),
    isSettled: SEQUELIZE.BOOLEAN,
    note: SEQUELIZE.STRING(100)
});

DB.CustomerQueue = DB.Client.define('CustomerQueue', {
    date: SEQUELIZE.DATE
});

DB.TeethTreatment = DB.Client.define('TeethTreatment', {
    name: SEQUELIZE.STRING(50),
    position: SEQUELIZE.ENUM('UL', 'UR', 'DR', 'DL'),
    number: SEQUELIZE.INTEGER,
    cost: SEQUELIZE.INTEGER,
    note: SEQUELIZE.STRING(100)
});

DB.Treatment = DB.Client.define('Treatment', {
    name: SEQUELIZE.STRING(50),
    cost: SEQUELIZE.INTEGER,
    note: SEQUELIZE.STRING(100)
});

DB.Medicine = DB.Client.define('Medicine', {
    name: SEQUELIZE.STRING(50),
    code: SEQUELIZE.STRING(20),
    dosage: SEQUELIZE.STRING,
    cost: SEQUELIZE.INTEGER,
    inStock: SEQUELIZE.INTEGER,
    note: SEQUELIZE.STRING(100)
});

/* Define Relationship */
DB.UserRole.hasMany(DB.UserRole, { as: 'Childrens', foreignKey: 'ParentId', through: null });
DB.Privilege.hasMany(DB.UserRole);
DB.UserRole.hasMany(DB.Privilege);
DB.UserRole.hasMany(DB.User);
DB.User.hasOne(DB.UserRole);
DB.Doctor.belongsTo(DB.User);
DB.User.hasOne(DB.Doctor);
DB.Patient.hasMany(DB.CustomerQueue);
DB.CustomerQueue.hasOne(DB.Patient);
DB.Doctor.hasMany(DB.CustomerQueue)
DB.CustomerQueue.hasOne(DB.Doctor);
DB.Doctor.hasMany(DB.PatientTreatment)
DB.PatientTreatment.hasOne(DB.Doctor);
DB.Treatment.hasMany(DB.PatientTreatment);
DB.PatientTreatment.hasOne(DB.Treatment);
DB.TeethTreatment.hasMany(DB.PatientTreatment);
DB.PatientTreatment.hasMany(DB.TeethTreatment);
DB.Medicine.hasMany(DB.PatientTreatment);
DB.PatientTreatment.hasMany(DB.Medicine);

function init(callback){
    DB.Client.sync().success(function() {
        console.log("Finish sync database");
        DB.ApplicationInfo.count().success(function(c) {
            if (c == 0) {
                console.log("Insert initial Data!")
                DB.ApplicationInfo.create({
                    name: "Applikasi Klinik D\'Smile",
                    version: 1.0,
                    schemaVersion: 1.0,
                    owner: "Tintus Ardi",
                    address: "Jalan simalakama"
                });
                
                var priv1 = DB.Privilege.build({
                    title: "ENTER_ADMIN_PAGE",
                    grant: true,
                });                     
                var priv2 = DB.Privilege.build({
                    title: "ENTER_DOCTOR_PAGE",
                    grant: true,
                });                     
                var priv3 = DB.Privilege.build({
                    title: "ENTER_RECEIPTIONIST_PAGE",
                    grant: true,
                });
                
                var role1 = DB.UserRole.build({
                    title: "Super Admin",
                });

                var role2 = DB.UserRole.build({
                    title: "Doctor",
                });

                var role3 = DB.UserRole.build({
                    title: "Receiptionist",
                });
                
                var user1 = DB.User.build({
                    username: "superadmin",
                    password: require('crypto').createHash('md5').update("superadmin").digest('hex'),
                    enabled: true,
                    email: "admin@yourhost.com"
                });

                var user2 = DB.User.build({
                    username: "doctor",
                    password: require('crypto').createHash('md5').update("doctor").digest('hex'),
                    enabled: true,
                    email: "doctor@yourhost.com"
                });

                var user3 = DB.User.build({
                    username: "ika",
                    password: require('crypto').createHash('md5').update("ika").digest('hex'),
                    enabled: true,
                    email: "ika@yourhost.com"
                });
                
                var doctor1 = DB.Doctor.build({
                    name: "Doctor Admin",
                    degree: "Drg. Dr. Mdg. MKes.",
                    phone: "081914773295",
                    address: "Jalan simalakama",
                    email: "admin@yourhost.com",
                    gender: "L",
                    birthDate: new Date(),
                    birthPlace: "Your Heart"
                });

                var doctor2 = DB.Doctor.build({
                    name: "Doctor Sahid",
                    degree: "Drg.",
                    phone: "081914773295",
                    address: "Jalan simalakama",
                    email: "sahid@yourhost.com",
                    gender: "L",
                    birthDate: new Date(),
                    birthPlace: "Somewhere"
                });
                
                var patient = DB.Patient.build({
                    name: "Budiman",
                    phone: "081914773295",
                    address: "Jalan simalakama",
                    jobs: "Pengangguran",
                    specialCondition: "Sick",
                    alergic: "Telur",
                    gender: "L",
                    birthDate: new Date(),
                    birthPlace: "Your Heart"
                });                 
                
                var posistions = ["UL", "UR", "DR", "DL"];
                for (var pos in posistions) {
                    for (var i = 1; i <= 8; i++) {
                        DB.TeethTreatment.create({
                            name: posistions[pos] + "_" + i,
                            position: posistions[pos],
                            number: i,
                            cost: 1000
                        });
                    }
                }
                
                DB.Treatment.create({
                    name: "Operasi",
                    cost: 1000000
                });
                
                DB.Medicine.create({
                    name: "Puyer 16",
                    code: "py16",
                    dosage: "1/3",
                    cost: 10000,
                    inStock: 30
                });
                                                
                priv1.save();
                priv2.save();
                priv3.save();
                doctor1.save();
                doctor2.save();
                patient.save(); 
                role1.save().success(function(role) {
                    role.setPrivileges([priv1, priv2, priv3]).success(function() {
                        console.log("Associated Role-Privilege");
                    });
                });
                role2.save().success(function(role) {
                    role.setPrivileges([priv2]).success(function() {
                        console.log("Associated Role-Privilege");
                    });
                });
                role3.save().success(function(role) {
                    role.setPrivileges([priv3]).success(function() {
                        console.log("Associated Role-Privilege");
                    });
                });
                user1.save().success(function(user) {
                    user.setDoctor(doctor1).success(function() {
                        console.log("Associated User-Doctor");
                    });
                    user.setUserRole(role1).success(function() {
                        console.log("Associated User-Role");
                    });
                });
                user2.save().success(function(user) {
                    user.setDoctor(doctor2).success(function() {
                        console.log("Associated User-Doctor");
                    });
                    user.setUserRole(role2).success(function() {
                        console.log("Associated User-Role");
                    });
                }); 
                user3.save().success(function(user) {
                    user.setUserRole(role3).success(function() {
                        console.log("Associated User-Role");
                    });
                });                
            }
            callback(DB);
        }).error(function(e){
            console.log("Cannot access Table ApplicationInfo: ", arguments);
            process.exit();
        }); 
    }).error(function(e){
        console.log("Failed to sync database: ", arguments);
        process.exit();
    });
    return DB;
}

module.exports = init;
