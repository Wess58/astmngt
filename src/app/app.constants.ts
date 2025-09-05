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
		path: '/assets',
		icon:'fa-box-archive'
	},
	{
		title: 'LOCATIONS',
		path: '/location',
		icon:'fa-location-dot'
	},
	{
		title: 'DEPARTMENTS',
		path: '/departments',
		icon:'fa-building'
	},
	{
		title: 'ASSET_CATEGORIES',
		path: '/asset-categories',
		icon:'fa-tags'
	},
	{
		title: 'USER_MANAGEMENT',
		path: '/user-management',
		icon:'fa-user-gear'
	},
	{
		title: 'ROLE_MATRIX',
		path: '/role-matrix',
		icon:'fa-diagram-project'
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


export const FILE_BORDER_KEYS = [
	{
		style: 'green-text',
		desc: 'Successful upload',
		titleDesc: 'File has been successfully uploaded',
	},
	{
		style: 'red-text',
		desc: 'Upload failed',
		titleDesc: 'Click to retry icon failed uploads or try again later',
	},
	{
		style: 'orange-text',
		desc: 'Duplicate file',
		titleDesc: 'Duplicate files are skipped during upload',
	},
];

