import React from 'react'
import generateColor from '../helpers/colorGradient'
import isEven from '../helpers/isEven'

const Constructor = () => {
	const [globalState, setGlobalState] = React.useState({
		rowCount: 2,
		columnCount: 2,
		colorInputEnd: '#00af3a',
		colorInputStart: '#121864',
		gradientArr: generateColor('#00af3a', '#121864', 4),
		countOfRepeatFirstColor: 3,
		countOfRepeatGradientColor: 4,
		countOfRepeatSecondColor: 3
	})

	const {
		rowCount,
		columnCount,
		colorInputEnd,
		colorInputStart,
		gradientArr,
		countOfRepeatFirstColor,
		countOfRepeatGradientColor,
		countOfRepeatSecondColor
	} = globalState

	React.useEffect(
		() =>
			setGlobalState({
				...globalState,
				gradientArr: generateColor(
					colorInputStart,
					colorInputEnd,
					countOfRepeatGradientColor
				)
			}),
		[colorInputEnd, colorInputStart, countOfRepeatGradientColor]
	)

	const handlerChangeState = (e) =>
		setGlobalState({
			...globalState,
			[e.target.name]: e.target.value
		})

	//! GLOBAL FUNCTIONS
	const canvas = React.useRef(null)
	const [isFront, setIsFront] = React.useState(true)
	const [isDouble, setIsDouble] = React.useState(false)
	const handlerSetIsFront = () => setIsFront(!isFront)
	const handlerSetIsDouble = () => setIsDouble(!isDouble)
	//! GLOBAL FUNCTIONS

	React.useEffect(() => {
		const drawEllipse = (ctx, coords, sizes, vector, color = 'red') => {
			const vLen = Math.sqrt(
				vector[0] * vector[0] + vector[1] * vector[1]
			)
			const e = [vector[0] / vLen, vector[1] / vLen]
			const p = 4 / 3

			const a = [e[0] * sizes[0] * p, e[1] * sizes[0] * p]
			const b = [e[1] * sizes[1], -e[0] * sizes[1]]

			const dotB1 = [coords[0] + b[0], coords[1] + b[1]]
			const dotB2 = [coords[0] - b[0], coords[1] - b[1]]

			const c1 = [a[0] + b[0], a[1] + b[1]]
			const c2 = [a[0] - b[0], a[1] - b[1]]

			const dotC1 = [coords[0] + c1[0], coords[1] + c1[1]]
			const dotC2 = [coords[0] + c2[0], coords[1] + c2[1]]
			const dotC3 = [coords[0] - c1[0], coords[1] - c1[1]]
			const dotC4 = [coords[0] - c2[0], coords[1] - c2[1]]

			ctx.strokeStyle = 'black'
			ctx.fillStyle = color
			ctx.beginPath()
			ctx.moveTo(dotB1[0], dotB1[1])
			ctx.bezierCurveTo(
				dotC1[0],
				dotC1[1],
				dotC2[0],
				dotC2[1],
				dotB2[0],
				dotB2[1]
			)
			ctx.bezierCurveTo(
				dotC3[0],
				dotC3[1],
				dotC4[0],
				dotC4[1],
				dotB1[0],
				dotB1[1]
			)
			ctx.stroke()
			ctx.fill()
			ctx.closePath()
		}

		/* OLD VERSION WITHOUT CYCLING GRADIENT
        const cycledCounter = (num, max) => {
			if (num < max - 1) {
				return num + 1
			} else {
				return 0
			}
        }
        */
		let goReverse = false
		const cycledCounter = (
			num,
			firstCondition,
			secondCondition,
			thirdCondition
		) => {
			if (num <= thirdCondition - 1 && !goReverse) {
				if (num === thirdCondition - 1) {
					goReverse = true
					return secondCondition - 1
				} else {
					return num + 1
				}
			}

			if (num >= 0 && goReverse) {
				if (num === 0) {
					goReverse = false
					return firstCondition
				} else {
					return num - 1
				}
			}
		}

		const fillByColor = (number, firstCondition, secondCondition) => {
			switch (number < firstCondition) {
				case true:
					return colorInputStart
				default:
					switch (number >= secondCondition) {
						case true:
							return colorInputEnd
						default: {
							return `#${gradientArr[number - firstCondition]}`
						}
					}
			}
		}

		const ctx = canvas && canvas.current && canvas.current.getContext('2d')

		const draw = () => {
			ctx.clearRect(0, 0, canvas.current.width, canvas.current.height)
			ctx.fillStyle = 'rgb(255,255,255)'
			ctx.fillRect(0, 0, canvas.current.width, canvas.current.height)
			ctx.setTransform(1, 0, 0, -1, 0, canvas.current.height)

			let number = 0
			let gradientColorNumber = 0

			const FIRST_CONDITION = +countOfRepeatFirstColor
			const SECOND_CONDITION =
				FIRST_CONDITION + +countOfRepeatGradientColor
			const THIRD_CONDITION = SECOND_CONDITION + +countOfRepeatSecondColor

			const drawCustomEllipse = (variant, j, i) => {
				const obj = {
					top: [
						[30 * j + 30 * (j - 1) + 5, 40 * i + 25],
						[25, 7],
						[20, 0]
					],
					firstBottom: [
						[30 * j + 30 * (j - 1) - 25, 40 * i - 25],
						[25, 7],
						[20, 0]
					],
					lastBottom: [
						[30 * j + 30 * (j - 1) + 35, 40 * i - 25],
						[25, 7],
						[20, 0]
					],
					rightSlopping: [
						[20 * j + 40 * (j - 1), 40 * i],
						[20, 7],
						[-7, 10]
					],
					leftSlopping: [
						[50 * j + 10 * (j - 1), 40 * i],
						[20, 7],
						[7, 10]
					]
				}
				return drawEllipse(
					ctx,
					...obj[variant],
					fillByColor(
						number,
						FIRST_CONDITION,
						SECOND_CONDITION,
						gradientColorNumber
					)
				)
			}

			for (let i = 1; i <= rowCount; i++) {
				for (
					let j = isEven(i) ? 1 : columnCount;
					isEven(i) ? j <= columnCount : j > 0;
					isEven(i) ? j++ : j--
				) {
					if (isEven(i)) {
						//! FIRST BOTTOM ELLIPSIS
						if (!isFront || isDouble) {
							drawCustomEllipse('firstBottom', j, i)
						}
						number = cycledCounter(
							number,
							FIRST_CONDITION,
							SECOND_CONDITION,
							THIRD_CONDITION
						)
						//! FIRST BOTTOM ELLIPSIS

						//! RIGHT SLOPPING ELLIPSIS
						if (isFront || isDouble) {
							drawCustomEllipse('rightSlopping', j, i)
						}
						number = cycledCounter(
							number,
							FIRST_CONDITION,
							SECOND_CONDITION,
							THIRD_CONDITION
						)
						//! RIGHT SLOPPING ELLIPSIS

						//! TOP ELLIPSIS
						if (!isFront || isDouble) {
							drawCustomEllipse('top', j, i)
						}
						number = cycledCounter(
							number,
							FIRST_CONDITION,
							SECOND_CONDITION,
							THIRD_CONDITION
						)
						//! TOP ELLIPSIS

						//! LEFT SLOPPING ELLIPSIS
						if (isFront || isDouble) {
							drawCustomEllipse('leftSlopping', j, i)
						}
						number = cycledCounter(
							number,
							FIRST_CONDITION,
							SECOND_CONDITION,
							THIRD_CONDITION
						)
						//! LEFT SLOPPING ELLIPSIS

						//! LAST BOTTOM ELLIPSIS
						if (j === +columnCount) {
							if (!isFront || isDouble) {
								drawCustomEllipse('lastBottom', j, i)
							}
							number = cycledCounter(
								number,
								FIRST_CONDITION,
								SECOND_CONDITION,
								THIRD_CONDITION
							)
						}
						//! LAST BOTTOM ELLIPSIS
					} else {
						//! LAST BOTTOM ELLIPSIS
						if (!isFront || isDouble) {
							drawCustomEllipse('lastBottom', j, i)
						}
						number = cycledCounter(
							number,
							FIRST_CONDITION,
							SECOND_CONDITION,
							THIRD_CONDITION
						)
						//! LAST BOTTOM ELLIPSIS

						//! LEFT SLOPPING ELLIPSIS
						if (isFront || isDouble) {
							drawCustomEllipse('leftSlopping', j, i)
						}
						number = cycledCounter(
							number,
							FIRST_CONDITION,
							SECOND_CONDITION,
							THIRD_CONDITION
						)
						//! LEFT SLOPPING ELLIPSIS

						//! TOP ELLIPSIS
						if (!isFront || isDouble) {
							drawCustomEllipse('top', j, i)
						}
						number = cycledCounter(
							number,
							FIRST_CONDITION,
							SECOND_CONDITION,
							THIRD_CONDITION
						)
						//! TOP ELLIPSIS

						//! RIGHT SLOPPING ELLIPSIS
						if (isFront || isDouble) {
							drawCustomEllipse('rightSlopping', j, i)
						}
						number = cycledCounter(
							number,
							FIRST_CONDITION,
							SECOND_CONDITION,
							THIRD_CONDITION
						)
						//! RIGHT SLOPPING ELLIPSIS

						if (+j === 1) {
							//! FIRST BOTTOM ELLIPSIS
							if (!isFront || isDouble) {
								drawCustomEllipse('firstBottom', j, i)
							}
							number = cycledCounter(
								number,
								FIRST_CONDITION,
								SECOND_CONDITION,
								THIRD_CONDITION
							)
							//! FIRST BOTTOM ELLIPSIS
						}
					}
				}
			}
		}
		draw()
	}, [
		canvas,
		rowCount,
		columnCount,
		gradientArr,
		isFront,
		isDouble,
		colorInputStart,
		colorInputEnd,
		countOfRepeatFirstColor,
		countOfRepeatGradientColor,
		countOfRepeatSecondColor
	])

	const handlerSaveImage = () => {
		var dataURL = canvas.current.toDataURL('image/jpeg')
		var link = document.createElement('a')
		document.body.appendChild(link) // Firefox requires the link to be in the body :(
		link.href = dataURL
		link.download = `${isFront ? 'front-pattern' : 'back-pattern'}.jpg`
		link.click()
		document.body.removeChild(link)
	}

	return (
		<main>
			<div className='container'>
				<div className='settings-column'>
					<div className='color-indicator--wrapper'>
						{gradientArr.map((el, idx) => (
							<span
								className='color-indicator'
								style={{backgroundColor: `#${el}`}}
								key={idx}>
								{idx + 1}
							</span>
						))}
					</div>
					<div className='gradient-settings'>
						<label>
							Gradient start
							<input
								type='color'
								name='colorInputStart'
								value={colorInputStart}
								onChange={handlerChangeState}
							/>
						</label>
						<label>
							Gradient end
							<input
								type='color'
								name='colorInputEnd'
								value={colorInputEnd}
								onChange={handlerChangeState}
							/>
						</label>
					</div>
					<div className='color-settings'>
						<label>
							Count of first colors
							<input
								type='number'
								name='countOfRepeatFirstColor'
								value={countOfRepeatFirstColor}
								onChange={handlerChangeState}
							/>
						</label>
						<label>
							Count of gradient colors
							<input
								type='number'
								name='countOfRepeatGradientColor'
								value={countOfRepeatGradientColor}
								onChange={handlerChangeState}
							/>
						</label>
						<label>
							Count of second colors
							<input
								type='number'
								name='countOfRepeatSecondColor'
								value={countOfRepeatSecondColor}
								onChange={handlerChangeState}
							/>
						</label>
					</div>
					<div className='canvas-settings'>
						<label>
							Row count
							<input
								type='number'
								name='rowCount'
								value={rowCount}
								onChange={handlerChangeState}
							/>
						</label>
						<label>
							Column count
							<input
								type='number'
								name='columnCount'
								value={columnCount}
								onChange={handlerChangeState}
							/>
						</label>
					</div>
					<div style={{display: 'flex', gap: '20px'}}>
						<button onClick={handlerSetIsDouble}>
							{isDouble ? 'Two' : 'One'} side
						</button>
						{!isDouble && (
							<button onClick={handlerSetIsFront}>
								{isFront ? 'Back' : 'Front'} side
							</button>
						)}
					</div>
				</div>
				<div>
					<canvas
						ref={canvas}
						onClick={handlerSaveImage}
						width='900'
						height='730'
					/>
				</div>
			</div>
		</main>
	)
}

export default Constructor
