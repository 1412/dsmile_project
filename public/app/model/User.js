/**
 * This view is used to present the details of a single Ticket.
 */
Ext.define('App.model.User', {
    extend: 'App.model.Base',

    fields: [
		'address',
		'degree',
		'email',
		'gender',
		{ name: 'isDoctor', type: 'boolean' },
		'name',
		'phone',
		'privileges',
		'role',
		'username'
    ]
});
