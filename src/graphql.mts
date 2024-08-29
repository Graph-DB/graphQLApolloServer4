const { ApolloServer, gql } = require("@apollo/server");
const {
  startServerAndCreateLambdaHandler,
  handlers,
} = require("@as-integrations/aws-lambda");

const typeDefs = gql`
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

export const graphqlHandler = startServerAndCreateLambdaHandler(
    server,
    handlers.creatAPIGatewayProxyEventV2RequestHandler()
)
