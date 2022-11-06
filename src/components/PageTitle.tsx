import { Title } from "@solidjs/meta"

const PageTitle = (props: { content: string }) => {
	  return <Title>{props.content} | metar.gg</Title>
}

export default PageTitle
