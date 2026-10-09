# Command-line guide

Manage notes from your terminal: create them, list them, archive them. These commands use the same app logic as the web UI. A note you add here shows up at `/notes`, and the reverse is also true.

## Before you start

Run these once, from the project folder:

```bash
pnpm install       # install dependencies
pnpm db:migrate    # create the database (safe to run again at any time)
```

`pnpm dev` also runs `db:migrate`, so if you have already started the web app, you're set.

## Commands at a glance

| What you want                | Command                                    |
| ---------------------------- | ------------------------------------------ |
| Add a note                   | `pnpm note:create <title> [--body <text>]` |
| See your notes               | `pnpm note:list`                           |
| See notes, archived included | `pnpm note:list --all`                     |
| Archive a note               | `pnpm note:archive <id>`                   |
| Set up / update the database | `pnpm db:migrate`                          |

---

## Add a note — `note:create`

```bash
pnpm note:create Buy groceries
pnpm note:create "Buy groceries" --body "Milk, eggs, sourdough"
pnpm note:create Call the dentist -b "Reschedule to next month"
```

- **Title** (required): everything that isn't an option. Quotes are optional: `Buy groceries` and `"Buy groceries"` mean the same.
- **`--body <text>`** or **`-b <text>`** (optional): the note's text. Quote it if it contains spaces.

The new note is printed. Keep its `id` if you plan to archive the note later:

```json
{
  "id": "0df20fe8-686e-446c-ba7f-9be86f8bf705",
  "title": "Buy groceries",
  "body": "Milk, eggs, sourdough",
  "createdAt": "2026-10-09T12:09:49.020Z",
  "archivedAt": null
}
```

Rules:

- The title can't be blank, and can be at most 120 characters. Spaces at either end are trimmed.
- The body can be at most 10,000 characters.

## See your notes — `note:list`

```bash
pnpm note:list          # active notes only
pnpm note:list --all    # include archived notes (short form: -a)
```

Notes are listed newest first:

```json
{
  "notes": [
    { "id": "…", "title": "Podcast recommendations", "body": "…", "createdAt": "…", "archivedAt": null },
    { "id": "…", "title": "Car service", "body": "…", "createdAt": "…", "archivedAt": null }
  ]
}
```

An archived note has a date in `archivedAt` instead of `null`.

## Archive a note — `note:archive`

```bash
pnpm note:archive 0df20fe8-686e-446c-ba7f-9be86f8bf705
```

Archiving hides a note from the default list without deleting it. Use `note:list --all` to see it again. A note can only be archived once.

Find the `id` with `pnpm note:list`.

---

## Tips

**Get just the titles.** The output is JSON, so it pipes into [`jq`](https://jqlang.org/). Use `--silent` so pnpm's own header doesn't break the JSON:

```bash
pnpm --silent note:list | jq -r '.notes[].title'
```

**Grab the newest note's id:**

```bash
pnpm --silent note:list | jq -r '.notes[0].id'
```

**Add notes in bulk:**

```bash
for t in "Water plants" "Backup photos" "Update CV"; do pnpm note:create "$t"; done
```

**Use a different database.** By default notes live in `data/app.db`. Point at another file for one command:

```bash
DATABASE_URL=data/scratch.db pnpm db:migrate
DATABASE_URL=data/scratch.db pnpm note:list
```

To make the change permanent, copy `.env.example` to `.env` and edit `DATABASE_URL` there.

**See the SQL being run:** set `DB_LOG_ENABLED=true` (inline or in `.env`).

---

## When something goes wrong

Every error prints a short message and exits with code `1`, so scripts can detect failures.

| You see                                              | What it means                             | Fix                                           |
| ---------------------------------------------------- | ----------------------------------------- | --------------------------------------------- |
| `InvalidNoteTitle: Note title must not be empty`     | No title was given, or it was only spaces | Add a title: `pnpm note:create My title`      |
| `InvalidNoteTitle: … at most 120 characters`         | Title too long                            | Shorten it, and put the detail in `--body`    |
| `NoteBodyTooLong: …`                                 | Body over 10,000 characters               | Shorten the body                              |
| `EntityNotFound: Note not found: <id>`               | No note has that id                       | Copy the id again from `pnpm note:list --all` |
| `NoteAlreadyArchived: Note <id> is already archived` | The note was archived before              | Nothing to do                                 |
| `Usage: … ` + `Unknown option '--foo'`               | A flag the command doesn't know           | Check the usage line it printed               |
| `Usage: note:archive <id>` + `expected string`       | The id is missing                         | Pass the id: `pnpm note:archive <id>`         |
| `SqliteError: no such table: notes`                  | The database hasn't been set up           | Run `pnpm db:migrate`                         |
