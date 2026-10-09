# Bundle Template

Ubiquitous language for this app. Every term below names something in code; use these names in code, errors, and prose.

> Replace the **Notes** section with your own domain. Keep the table shape: term, definition, aliases to avoid.

## Notes (example module)

| Term         | Definition                                                                | Aliases to avoid      |
| ------------ | ------------------------------------------------------------------------- | --------------------- |
| **Note**     | A titled piece of text with a creation time, optionally archived          | Memo, entry, post     |
| **Title**    | The short, non-empty name of a **Note** (at most 120 characters, trimmed) | Name, subject, header |
| **Body**     | The free text of a **Note**; may be empty                                 | Content, text         |
| **Archived** | A **Note** hidden from the default list; archiving happens once           | Deleted, hidden       |

## Architecture

| Term           | Definition                                                                                   | Aliases to avoid       |
| -------------- | -------------------------------------------------------------------------------------------- | ---------------------- |
| **Use Case**   | One application operation: command/query + handler + action + entrypoint                     | Service, controller    |
| **Command**    | A validated request to change state                                                          | DTO, request           |
| **Query**      | A validated request to read state                                                            | Filter, request        |
| **Action**     | The implementation of a **Use Case** against **Ports**                                       | Interactor, service    |
| **Port**       | An interface the core needs from the outside world (`NoteRepository`, `Clock`)               | Gateway, provider      |
| **Adapter**    | One implementation of a **Port** (`drizzle`, `fake`, `system`)                               | Driver, implementation |
| **View**       | The plain-JSON shape a **Use Case** returns                                                  | DTO, response, model   |
| **Entrypoint** | The protocol-neutral door into a **Use Case**: Zod input + `run`, shared by tRPC and the CLI | Endpoint, route        |
