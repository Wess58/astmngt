export const ALL_OPERATIONS = [
	"searchRecord",
	"viewRecord",
	"downloadStatement",
	"resendStatement",
	"viewFiles",
	"viewFile",
	"viewUsers",
	"createUser",
	"editUser",
	"deleteUser",
	"viewAuditLogs"
]

export const MENUS_WITH_PATHS = [
	{
		title: 'ASSETS',
		path: '/assets'
	},
	{
		title: 'LOCATIONS',
		path: '/location'
	},
	{
		title: 'DEPARTMENTS',
		path: '/departments'
	},
	{
		title: 'ASSET_CATEGORIES',
		path: '/asset-categories'
	},
	{
		title: 'USER_MANAGEMENT',
		path: '/user-management'
	},
	{
		title: 'ROLE_MATRIX',
		path: '/role-matrix'
	},
]


export const MONTHS = [
	'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];


export enum TaskStatus {
	NEW = 'NEW',

	IN_PROGRESS = 'IN_PROGRESS',

	PENDING_CALLBACK = 'PENDING_CALLBACK',

	SUCCESSFUL = 'SUCCESSFUL',

	FAILED = 'FAILED',

	UNKNOWN = 'UNKNOWN',
}


export const REQUEST_STATUSES = [
	'APPROVED', 'REJECTED', 'NEW'
]

