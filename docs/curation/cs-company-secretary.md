# CS (Company Secretary), ICSI: topic map and sources

**Draft, needs a quick human check.** Checked on 2026-09-29. Machine-readable version: `backend/app/data/fields/cs-company-secretary.json`.

## Syllabus source

- Body: The Institute of Company Secretaries of India (ICSI).
- Main PDF: [ICSI New Syllabus 2022](https://icsis3-console.kreate-cloud.com:9002/icsi-prod/media/cms_uploads/icsi-new-syllabus-2022-9a82f048.pdf), linked from icsi.edu/new-syllabus-2022 (page updated 2026-09-24).
- CSEET: [Restructured CSEET syllabus, from June 2026](https://icsis3-console.kreate-cloud.com:9002/icsi-prod/media/cms_uploads/restructured-syllabus-cseet-with-cover-7018cfdc.pdf). Four subjects: Business Communication, Fundamentals of Accounting, Economic and Business Environment, Business Laws and Management. The main PDF still shows the old 4-part MCQ CSEET, so we used this file.
- Version: Syllabus 2022, as updated. Executive papers 1, 2 and 6 were trimmed from Dec 2025. Elective 4.6 (IFSCA) was added from June 2026. No newer syllabus found: the June 2026 results and Dec 2026 exams still run under Syllabus 2022.
- Structure: 3 levels, 18 papers (Professional electives grouped under "Elective 1" and "Elective 2"), 66 topics in total. Topic names are our own short words.

Professional electives included: 4.1 CSR and Social Governance, 4.2 Internal and Forensic Audit, 4.3 IPR, 4.4 AI, Data Analytics and Cyber Security, 4.5 Advanced Direct Tax, 4.6 IFSCA; 7.1 Arbitration, Mediation and Conciliation, 7.2 GST and Corporate Tax Planning, 7.3 Labour Laws, 7.4 Banking and Insurance, 7.5 Insolvency and Bankruptcy.

## Sources

Web pages used:
- **SD-E**: [sahildubey.com, best channels for CS Executive 2026](https://www.sahildubey.com/2026/05/best-youtube-channel-for-cs-executive.html)
- **SD-P**: [sahildubey.com, CS Professional teachers, Dec 2026](https://www.sahildubey.com/2026/07/cs-professional-best-youtube-teachers-both-groups.html)
- **CT**: [CharteredTeam, free resources for CS](https://charteredteam.com/free-resources-for-cs-cseet-executive-and-professional-preparation/) (subject-wise lists for all three levels)
- **CSA**: csaspirant.com playlist posts ([module 1](https://www.csaspirant.com/post/module-1-free-lectures-playlist-cs-executive-2023), [module 2](https://www.csaspirant.com/post/module-2-free-lectures-playlist-cs-executive-2023)), read through web.archive.org because the site blocks fetching
- **RAJ**: [therajpicz blog list](https://therajpicz.blogspot.com/2023/04/top-9-best-youtube-channels-for-cs.html) (weak; see below)

| Name | Channel / playlist ID | Lang | Levels | Topics | Why trusted | Sources |
|---|---|---|---|---|---|---|
| ICSI Official YouTube Channel | UCoBn0KZLy4aVBgQ8YG92iuQ ❓ | en, hi ❓ | all | Exec + Prof papers | The exam body; sessions and updates | SD-P, RAJ |
| CS Wallah by PW | UCwUqDlLUrwhPrnXA5bG5cnw | hi, en | CSEET, Exec | all CSEET + Exec papers | Full-course option | SD-E, CT (+ PW's own page) |
| CS Amit Vohra Classes by Unacademy | UCa7BV8OCcttEO0q51dILj9g | hi, en | CSEET, Exec | all CSEET + Exec papers | Main pick for Executive law papers | SD-E, CT |
| Unacademy CS | UCDfOolC5SdHAN0z1IYuYWHw ❓ | hi, en | Exec | Exec papers | Backup channel | SD-E, CT |
| CSCARTINDIA | UCs269cNJCrk8KXBqqiqdUiA | hi, en | CSEET, Exec | CSEET; JIGL, CLP, SBIL, CAFM, Tax | Backup for law and revision | SD-E, CT |
| CSEET Unique Academy for Commerce | UCgbAXZ-3f_saF_G53etfl0Q | hi, en | all | CSEET; JIGL, CMSL, ECIPL; ESG, DPA, SMCF, CRVI | Demos, one-shots | CT, SD-P |
| YES Academy for CS | UCS-k1MlL0heTVU--8f-nPiw | hi, en | all | CSEET; SBIL; all Prof core papers; CSR, Labour, IBC electives | Named faculty per Professional paper | SD-P, CT |
| Inspire Academy | UCKxFnLZHM3IbN7ndGEZMcyQ ❓ | hi, en | all | JIGL, CMSL; most Prof papers; CSR | Wide coverage | CT only |
| Ekcel Academy - Company Secretary Coaching | UC1qMMZo_6klkIB9860MsohQ | hi, en | all | CSEET; all Exec; ESG, CRVI | Listed for every Exec paper | CT only |
| ArivuPro Academy | UCP8wEbtqYPaPT6iS_9T6A1Q | en | Exec, Prof | CLP, CMADD | English-medium option | CT only |
| StudyAtHome | UCi9SjOgQgUBedh298NLTplQ | hi, en | Exec | CAFM, Tax | Best pick for CAFM on SD-E | SD-E only |
| Playlist: CS Amit Vohra, Company Law | PLRk6rEeTCuncLCrKNGiBEBC2BXgnQ_MbC | hi, en | Exec | CLP | Linked as the Company Law playlist | SD-E |
| Playlist: StudyAtHome, tax laws | PLyY2ccCWylAqNkniAAHNtuW7mu5d5CgE2 | hi, en | Exec | Tax | Linked for tax laws | SD-E |
| Playlist: Shubhamm Sukhlecha, Securities Law revision | PLye1s2DD-q2OfLZG3X4FBRxj91ahbDX00 | hi, en | Exec | CMSL | Teacher named on two pages | CSA, CT |
| Playlist: CA Vivek Gaba, GST revision | PLCqY6_dqmF2IQXgrtJV5L0575EMeaxl5I | hi, en | Exec | Tax (GST) | Teacher named on two pages | CSA, CT |

Channel IDs: 4 came straight from channel URLs on the pages (CS Wallah, CSCARTINDIA, Unique Academy, ArivuPro); 1 came from a public analytics URL (Ekcel). The other 7 were resolved from handles with `tools/resolve_channel.py`, one lookup each. Handles for Amit Vohra and CS Wallah gave the same IDs as the page URLs. The ❓ IDs came from legacy `/user/` or `/c/` URLs turned into handles, so someone should open each channel and confirm it is the right one.

No motivational channels were found in the web sources, so none are listed.

## Check first

1. The three ❓ channel IDs (ICSI, Unacademy CS, Inspire Academy): open each channel and confirm the name.
2. The two older playlists (Sukhlecha, Vivek Gaba) are from 2022–23 attempts and may use the old syllabus. Keep them only if nothing newer turns up.
3. Four channels have only one independent listing: Inspire, Ekcel, ArivuPro, StudyAtHome.
4. Professional elective coverage is thin: only CSR, Labour and IBC have any mapped source.
5. The web evidence is mostly blogs. Reddit and Quora were blocked, so no student-forum posts were read.

## Doubtful / excluded

- **CS Aspirant** (youtube.com/c/CSAspirant): a link collector that sells "notes collection" packages through Google Drive. Nobody else recommends it, and the resale of notes is a possible copyright risk. Used only as a source of links.
- **therajpicz blog list**: low quality. It names unrelated channels (CS Dojo, Kunal Bothra, "StudyByTech"). Used only as a second mention for ICSI.
- **Seller pages** (KCC Tutorials, lecturewala, smartlearningdestination, gmtestseries, expertbano): they sell pen-drive courses and praise their own faculty. Not used as recommendations.
- **pw.live page**: PW promoting its own channel. Kept as a note, not counted as independent.
- **Teachers listed only once, with no channel ID found**: CS Anoop Jain, MEPL Classes / CA Mohit Agarwal, Jahangir Tutorial, CS Duniya, VG Study Hub, Team NKJ, CS Shantanu, CA Amit Talda, CA Raj Awate, CS Shubham Abad, CS Shubham Modi. Candidates for the next pass.
- **Random playlists found in search** ("cs executive ke best online lectures", Takshila Learning): no recommendation found.
- No piracy or "paper leak" channels turned up, but we did not watch any videos to check.
