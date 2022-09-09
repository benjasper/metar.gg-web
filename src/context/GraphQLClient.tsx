import { createContext, createSignal, useContext } from "solid-js";
import { createGraphQLClient, gql, GraphQLClientQuery } from "@solid-primitives/graphql";

const GraphQLContext = createContext<GraphQLClientQuery>()

export function GraphQLProvider(props: { children: any, client: GraphQLClientQuery }) {
	const [client, setClient] = createSignal(props.client || undefined)

	return (
		<GraphQLContext.Provider value={client()}>
			{props.children}
		</GraphQLContext.Provider>
	)
}

export function useGraphQL() {
	return useContext<GraphQLClientQuery>(GraphQLContext)
}
