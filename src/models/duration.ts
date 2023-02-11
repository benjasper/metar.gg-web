class Duration {
	private milliseconds: number

	constructor(milliseconds: number) {
		this.milliseconds = milliseconds
	}

	static fromDates(lessRecentDate: Date, moreRecentDate: Date): Duration {
		return new Duration(lessRecentDate.getTime() - moreRecentDate.getTime())
	}

	static fromMilliseconds(milliseconds: number) {
		return new Duration(milliseconds)
	}

	static fromSeconds(seconds: number) {
		return new Duration(seconds * 1000)
	}

	static fromNanoSeconds(nanoSeconds: number): Duration {
		return new Duration(nanoSeconds / 1000000)
	}

	isFuture(): boolean {
		return this.milliseconds > 0
	}

	isPast(): boolean {
		return this.milliseconds < 0
	}

	asSeconds(): number {
		return Math.abs(Math.round(this.milliseconds / 1000))
	}

	asMinutes(): number {
		return Math.abs(Math.round(this.milliseconds / 1000 / 60))
	}

	asHours(): number {
		return Math.abs(Math.round(this.milliseconds / 1000 / 60 / 60))
	}

	asDays(): number {
		return Math.abs(Math.round(this.milliseconds / 1000 / 60 / 60 / 24))
	}

	asWeeks(): number {
		return Math.abs(Math.round(this.milliseconds / 1000 / 60 / 60 / 24 / 7))
	}

	asMonths(): number {
		return Math.abs(Math.round(this.milliseconds / 1000 / 60 / 60 / 24 / 30))
	}

	asYears(): number {
		return Math.abs(Math.round(this.milliseconds / 1000 / 60 / 60 / 24 / 30 / 12))
	}

	/**
	 * Builds a human readable string of the duration. The string will be
	 * approximate. For example, if the duration is 1 hour and 30 minutes, the
	 * string will be "1 hour". It supports plurals and singulars.
	 * as well as "in" or "ago" depending on the sign of the duration.
	 *
	 * @returns {string} a human readable but imprecise string of the duration
	 */
	humanImprecise(directionWord: boolean = true): string {
		const absoluteMilliseconds = Math.abs(this.milliseconds)

		const seconds = Math.floor(absoluteMilliseconds / 1000)
		const minutes = Math.floor(seconds / 60)
		const hours = Math.floor(minutes / 60)
		const days = Math.floor(hours / 24)
		const months = Math.floor(days / 30)
		const years = Math.floor(months / 12)

		const isFuture = this.milliseconds > 0

		const prepend = directionWord && isFuture ? 'in ' : ''
		const append = directionWord && !isFuture ? ' ago' : ''

		if (years > 0) {
			return prepend + years + ' year' + (years === 1 ? '' : 's') + append
		} else if (months > 0) {
			return prepend + months + ' month' + (months === 1 ? '' : 's') + append
		} else if (days > 0) {
			return prepend + days + ' day' + (days === 1 ? '' : 's') + append
		} else if (hours > 0) {
			return prepend + hours + ' hour' + (hours === 1 ? '' : 's') + append
		} else if (minutes > 0) {
			return prepend + minutes + ' minute' + (minutes === 1 ? '' : 's') + append
		} else if (seconds > 0) {
			return `${prepend}a few seconds${append}`
		} else {
			return 'just now'
		}
	}

	/**
	 * Returns a human readable string of the duration. The string will be
	 * precise. For example, if the duration is 1 hour and 30 minutes, the
	 * string will be "1 hour and 30 minutes". It also supports plurals and singulars.
	 * it will also print "in" or "ago" depending on the sign of the duration.
	 *
	 * @returns {string} a human readable string of the duration
	 */
	humanPrecise(omitSeconds: boolean = false, directionWord: boolean = true): string {
		const absoluteMilliseconds = Math.abs(this.milliseconds)

		const seconds = Math.floor(absoluteMilliseconds / 1000)
		const minutes = Math.floor(seconds / 60)
		const hours = Math.floor(minutes / 60)
		const days = Math.floor(hours / 24)
		const months = Math.floor(days / 30)
		const years = Math.floor(months / 12)

		const secondsRemainder = seconds % 60
		const minutesRemainder = minutes % 60
		const hoursRemainder = hours % 24
		const daysRemainder = days % 30
		const monthsRemainder = months % 12

		const isFuture = this.milliseconds > 0

		const prepend = directionWord && isFuture ? 'in ' : ''
		const append = directionWord && !isFuture ? ' ago' : ''

		const parts = []
		if (years > 0) {
			const yearsString = years === 1 ? '1 year' : `${years} years`
			parts.push(yearsString)
		}
		if (monthsRemainder > 0) {
			const monthsString = monthsRemainder === 1 ? '1 month' : `${monthsRemainder} months`
			parts.push(monthsString)
		}
		if (daysRemainder > 0) {
			const daysString = daysRemainder === 1 ? '1 day' : `${daysRemainder} days`
			parts.push(daysString)
		}
		if (hoursRemainder > 0) {
			const hoursString = hoursRemainder === 1 ? '1 hour' : `${hoursRemainder} hours`
			parts.push(hoursString)
		}
		if (minutesRemainder > 0) {
			const minutesString = minutesRemainder === 1 ? '1 minute' : `${minutesRemainder} minutes`
			parts.push(minutesString)
		}
		if ((secondsRemainder > 0 && !omitSeconds) || parts.length === 0) {
			const secondsString = secondsRemainder === 1 ? '1 second' : `${secondsRemainder} seconds`
			parts.push(secondsString)
		}

		if (parts.length === 0) {
			return 'now'
		} else if (parts.length === 1) {
			return `${prepend}${parts[0]}${append}`
		} else if (parts.length === 2) {
			return `${prepend}${parts[0]} and ${parts[1]}${append}`
		} else {
			const lastPart = parts.pop()
			return `${prepend}${parts.join(', ')}, and ${lastPart}${append}`
		}
	}
}

export default Duration
