import React, { SVGProps } from 'react';

const SvgWine = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg viewBox='0 0 24 24' className='svg-icon' {...props}>
			<g fill='none' fillRule='evenodd'>
				<path d='M0 0h24v24H0z' />
				<path
					d='M13 21.008A3.618 3.618 0 0116 23H8a3.618 3.618 0 013-1.992V15.5h2v5.508z'
					fill='currentColor'
					opacity={0.3}
				/>
				<path
					d='M8 4l-.5 4h9c-.062-.794-.23-2.127-.5-4H8zm.286-2h7.428c1.233 0 2.258.928 2.353 2.13l.475 6.037c.274 3.495-2.4 6.545-5.973 6.814a6.634 6.634 0 01-.497.019h-.144c-3.583 0-6.489-2.841-6.489-6.346 0-.163.007-.325.02-.487l.474-6.036C6.028 2.928 7.053 2 8.286 2z'
					fill='currentColor'
				/>
			</g>
		</svg>
	);
};

export default SvgWine;
