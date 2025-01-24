export const getUserData = `
  query {
    user {
      id
      login
      firstName
      lastName
      email
      createdAt
      auditRatio
      transactions( where: { _and: [{ type: { _eq: "xp" } }, { path: { _niregex: "(piscine)" } }] }
      order_by: { createdAt: asc }
      ) {
        type
        amount
        createdAt
        path
        object {
          name
        }
      }
      audits: transactions(where: { type: { _in: ["up", "down"] } }) {
        type
        amount
        createdAt
      }
    }
    xp: transaction_aggregate(where: { type: { _eq: "xp" }, eventId: { _eq: 148 } }) {
      aggregate {
        sum {
          amount
        }
      }
    }
    level: transaction(
      limit: 1
      order_by: { amount: desc }
      where: { type: { _eq: "level" }, eventId: { _eq: 148 } }
    ) {
      amount
    }
  }
`;