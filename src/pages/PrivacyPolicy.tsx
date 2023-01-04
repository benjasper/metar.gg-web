import { Meta } from '@solidjs/meta'
import Header from '../components/Header'
import Logo from '../components/Logo'
import PageContent from '../layouts/PageContent'

const PrivacyPolicy = () => {
	return (
		<PageContent title="Privacy policy" description="">
			<Meta name="robots" content="noindex" />

			<div class="container text-black dark:text-white-dark">
				<Header />
				<h1 class="pt-16 text-4xl font-bold">Privacy policy</h1>
				<p class="mt-4">
					We want to process as little personal information as possible when you use our website. That's why
					we've chosen Fathom Analytics for our website analytics, which doesn't use cookies and complies with
					the GDPR, ePrivacy (including PECR), COPPA and CCPA. Using this privacy-friendly website analytics
					software, your IP address is only briefly processed, and we (running this website) have no way of
					identifying you. As per the CCPA, your personal information is de-identified. You can read more
					about this on{' '}
					<a href="https://usefathom.com/compliance" target="_blank">
						Fathom Analytics' website
					</a>
					.
				</p>
				<p class="mt-4">
					The purpose of us using this software is to understand our website traffic in the most
					privacy-friendly way possible so that we can continually improve our website. The lawful basis as
					per the GDPR is "Article 6(1)(f); where our legitimate interests are to improve our website and
					business continually." As per the explanation, no personal data is stored over time.
				</p>
			</div>
		</PageContent>
	)
}

export default PrivacyPolicy
