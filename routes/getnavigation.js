var router = require('express').Router();

router.get('/', function(req, res) {
	try {
		var result = {
	        success: true,
	        children: []
		}
		var user = req.session.user;
		if (user) {
			var privileges = user.privileges;
			if (privileges) {
				if (privileges.indexOf("ENTER_ADMIN_PAGE") > -1) {
					result.children.push({            
				        text: "Administrative",
				        id: "administrative",
				        expanded: true,
				        description: "Administrative Panel",
				        children: [{
				            id: "admin-user",
				            text: "User, Role, & privileges",
				            description: "User, Role, and Privileges, Administration",
				            expanded: true,
				            children: [{
				            	id: "admin-user-user",
				            	text: "User",
				            	leaf: true
				            }, {
				            	id: "admin-user-role",
				            	text: "Role",
				            	leaf: true
				            }, {
				            	id: "admin-user-privileges",
				            	text: "Privileges",
				            	leaf: true
				            }]				            
				        }, {
				            id: "admin-patient",
				            text: "Magajemen Pasien",
				            leaf: true
				        }, {
				            id: "admin-doctor",
				            text: "Magajemen Dokter",
				            leaf: true
				        }, {
				            id: "admin-medical",
				            text: "Manajement Datar Medis",
				            description: "Daftar Obat obatan, Jenis Perawatan Gigi dan Umum, dll",
				            expanded: true,
				            children: [{
				            	id: "admin-medical-medicine",
				            	text: "Obat Obatan",
				            	leaf: true
				            }, {
				            	id: "admin-medical-treatment",
				            	text: "Perwatan Umum",
				            	leaf: true
				            }, {
				            	id: "admin-medical-teethtreatment",
				            	text: "Perwatan Gigi",
				            	leaf: true
				            }]	
				        }, {
				            id: "admin-report",
				            text: "Manajement Pelanggan",
				            description: "Daftar pelanggan periodik, dan embuatan laporan",
				            expanded: true,
				            children: [{
				            	id: "admin-report-customers",
				            	text: "Pelanggan",
				            	leaf: true
				            }, {
				            	id: "admin-report-makereport",
				            	text: "Buat Laporan",
				            	leaf: true
				            }, {
				            	id: "admin-report-graph",
				            	text: "Lihat Grafis Statistik",
				            	leaf: true
				            }]	
				        }]
				    });
			    }
		        if (privileges.indexOf("ENTER_DOCTOR_PAGE") > -1) {
					result.children.push({
			            text: "Dokter",
			            id: "doctor",
			            expanded: true,
			            description: "Panels are the basic container that makes up the structure of most applications. Panels have a header and body, and can be arranged in various ways using layouts.",
			            children: [{
			                id: "doctor-queue",
			                text: "Antrian Pasien",
			                leaf: true
			            }, {
			                id: "doctor-status",
			                text: "Status",
			                leaf: true
			            }]
			        });
		        }
				if (privileges.indexOf("ENTER_RECEIPTIONIST_PAGE") > -1) {
					result.children.push({
			            text: "Resepsionis",
			            id: "receiptionist",
			            expanded: true,
			            description: "Panels are the basic container that makes up the structure of most applications. Panels have a header and body, and can be arranged in various ways using layouts.",
			            children: [{
			                id: "receiptionist-main",
			                text: "Aplikasi Resepsionis",
			                leaf: true
			            }]
			        });
			    }
			    result.children.push({
		            text: "Settings",
		            id: "settings",
		            leaf: true
		        });
		        result.children.push({
		            text: "Logout",
		            id: "logout",
		            leaf: true
		        });
			}		
		}
	  	res.end(JSON.stringify(result));
	} catch (e) {
		next(e);
	}
});

module.exports = router;