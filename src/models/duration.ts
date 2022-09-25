class Duration {
	private milliseconds: number

	constructor(milliseconds: number) {
		this.milliseconds = milliseconds
	}
	
	static fromDates(moreRecentDate: Date, lessRecentDate: Date): Duration {
		return new Duration(moreRecentDate.getTime() - lessRecentDate.getTime())
	}

	static fromMilliseconds(milliseconds: number) {
		return new Duration(milliseconds)
	}

	static fromSeconds(seconds: number) {
		return new Duration(seconds * 1000)
	}

	asSeconds(): number {
		return Math.round(this.milliseconds / 1000)
	}

	asMinutes(): number {
		return Math.round(this.milliseconds / 1000 / 60)
	}

	asHours(): number {
		return Math.round(this.milliseconds / 1000 / 60 / 60)
	}

	asDays(): number {
		return Math.round(this.milliseconds / 1000 / 60 / 60 / 24)
	}

	asWeeks(): number {
		return Math.round(this.milliseconds / 1000 / 60 / 60 / 24 / 7)
	}

	asMonths(): number {
		return Math.round(this.milliseconds / 1000 / 60 / 60 / 24 / 30)
	}

	asYears(): number {
		return Math.round(this.milliseconds / 1000 / 60 / 60 / 24 / 30 / 12)
	}

	humanImprecise(): string {
		const seconds = Math.round(this.milliseconds / 1000)
		const minutes = Math.round(seconds / 60)
		const hours = Math.round(minutes / 60)
		const days = Math.round(hours / 24)
		const months = Math.round(days / 30)
		const years = Math.round(months / 12)

		if (seconds < 60) {
			return `a few seconds`
		} else if (minutes < 60) {
			return `${minutes} minutes`
		} else if (hours < 24) {
			return `${hours} hours`
		} else if (days < 30) {
			return `${days} days`
		} else if (months < 12) {
			return `${months} months`
		} else {
			return `${years} years`
		}
	}

	humanPrecise(): string {
		const seconds = Math.round(this.milliseconds / 1000)
		const minutes = Math.round(seconds / 60)
		const hours = Math.round(minutes / 60)
		const days = Math.round(hours / 24)
		const months = Math.round(days / 30)
		const years = Math.round(months / 12)

		if (seconds < 60) {
			return `${seconds} seconds`
		} else if (minutes < 60) {
			return `${minutes} minutes and ${seconds % 60} seconds`
		} else if (hours < 24) {
			return `${hours} hours, ${minutes % 60} minutes and ${seconds % 60} seconds`
		} else if (days < 30) {
			return `${days} days, ${hours % 24} hours, ${minutes % 60} minutes and ${seconds % 60} seconds`
		} else if (months < 12) {
			return `${months} months, ${days % 30} days, ${hours % 24} hours, ${minutes % 60} minutes and ${seconds % 60} seconds`
		} else {
			return `${years} years, ${months % 12} months, ${days % 30} days, ${hours % 24} hours, ${minutes % 60} minutes and ${seconds % 60} seconds`
		}
	}
}

export default Duration
