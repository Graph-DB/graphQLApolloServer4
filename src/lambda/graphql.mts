import { ApolloServer } from "@apollo/server";
import {
    startServerAndCreateLambdaHandler,
    handlers,
} from "@as-integrations/aws-lambda";

const typeDefs = `
    type Query {
        greetings(name: String = "GRANDstack"): String    
    }
`
const resolvers = {
    Query: {
        greetings: (parent: any, args: any, context: any) => {
            return `Hello, ${args.name}!`
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

export const handler = startServerAndCreateLambdaHandler(
    server,
    handlers.createAPIGatewayProxyEventRequestHandler(),
)
