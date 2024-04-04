import React, { SVGProps } from 'react';

const SvgBlender = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg viewBox='0 0 24 24' className='svg-icon' {...props}>
			<g fill='currentColor' fillRule='evenodd'>
				<path d='M17.202 13H15a1 1 0 000 2h1.642l-.64 2.286a1 1 0 01-.964.73h-7.07c-.645 0-1.312-1.437-2-4.313C4.823 12.948 3 10.911 3 8.516c0-3.037 1.322-5.5 2.953-5.5.024 0 .048 0 .072.002.076-.023 4.296-.024 12.66-.003a1 1 0 01.96 1.27l-.2.715H15a1 1 0 000 2h3.884l-.56 2H15a1 1 0 000 2h2.763l-.56 2zM6.445 11.016v-6c-.984.5-1.476 1.133-1.476 3 0 2.08 1.254 3 1.476 3z' />
				<path
					d='M6 19h10a2 2 0 012 2v1.5a.5.5 0 01-.5.5h-13a.5.5 0 01-.5-.5V21a2 2 0 012-2zm5 3a1 1 0 100-2 1 1 0 000 2z'
					opacity={0.3}
				/>
			</g>
		</svg>
	);
};

export default SvgBlender;
