import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
	transition(':enter', [
		style({ opacity: 0 }),
		animate('300ms ease-in', style({ opacity: 1 })),
	]),
	transition(':leave', [
		animate('300ms ease-out', style({ opacity: 0 })),
	]),
]);

export const slideInOut = trigger('slideInOut', [
	transition(':enter', [
		style({ transform: 'translateY(-20px)', opacity: 0 }),
		animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
	]),
	transition(':leave', [
		animate('300ms ease-in', style({ transform: 'translateY(-20px)', opacity: 0 })),
	]),
]);


export const fadeIn = trigger('fadeIn', [
	transition(':enter', [
		// :enter is alias to 'void => *'
		style({ opacity: 0 }),
		animate(600, style({ opacity: 1 })),
	]),
]);


export const fadeInResults = trigger('fadeInResults', [
	transition(':enter', [
		// :enter is alias to 'void => *'
		style({ opacity: 0 }),
		animate(250, style({ opacity: 1 })),
	]),
]);

export const fadeInGrow = trigger('fadeInGrow', [
	transition(':enter', [
		query(
			':enter',
			[
				style({ opacity: 0, marginTop: 40 }),
				stagger('90ms', [
					animate('500ms ease', style({ opacity: 1, marginTop: 0 })),
				]),
			],
			{ optional: true }
		),
	]),
]);