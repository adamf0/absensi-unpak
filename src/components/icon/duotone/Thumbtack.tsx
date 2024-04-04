import React, { SVGProps } from 'react';

const SvgThumbtack = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg viewBox='0 0 24 24' className='svg-icon' {...props}>
			<g fill='none' fillRule='evenodd'>
				<path d='M0 0h24v24H0z' />
				<path
					d='M11.673 8.33L15 6.1l-.878-.878a1 1 0 010-1.414l1.415-1.415a1 1 0 011.414 0l5.657 5.657a1 1 0 010 1.414l-1.415 1.415a1 1 0 01-1.414 0L18.9 10l-2.23 3.326c.256.925.328 1.905.196 2.882l-.432 3.197a1 1 0 01-1.698.573l-9.715-9.715a1 1 0 01.573-1.698l3.197-.432a7.175 7.175 0 012.882.197z'
					fill='currentColor'
				/>
				<path
					fill='currentColor'
					opacity={0.3}
					d='M8.818 14.06l-4.04 4.041-.556 2.677 2.677-.555 4.04-4.041z'
				/>
			</g>
		</svg>
	);
};

export default SvgThumbtack;
