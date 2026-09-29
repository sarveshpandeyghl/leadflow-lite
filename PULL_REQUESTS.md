# Open Pull Requests

You're the reviewer on these 5 PRs. Each branch was cut from `main` and contains one commit.
The commit message is the PR description. CI (`npm test`) is green on all of them.

| PR | Branch | Title | Author |
|----|--------|-------|--------|
| #1 | `pr/1-contact-search` | Instant contact search with highlighting & pagination | Rahul |
| #2 | `pr/2-invoice-discounts-tax` | Invoice discounts, tax & custom line items | Priya |
| #3 | `pr/3-http-retry-refresh` | HTTP retries with backoff + transparent token refresh | Arjun |
| #4 | `pr/4-appointment-reminders` | Automated 24h appointment reminders | Sneha |
| #5 | `pr/5-contact-cache` | LRU cache for contact details + editable panel | Karan |

## How to review

```bash
git log -1 pr/1-contact-search     # read the PR description
git diff main...pr/1-contact-search  # read the change
```

For each PR, leave review comments as you would on GitHub: what's wrong, why it matters, and how you'd fix it.
