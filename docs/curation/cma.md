# CMA (ICMAI) curator sheet: Draft, needs a quick human check

Checked on 2026-09-29. Machine-readable copy: `backend/app/data/fields/cma.json`.

## Syllabus source

- Body: The Institute of Cost Accountants of India (ICMAI).
- Page: https://icmai.in/ClntStudents/CMASyllabus (curriculum pages for Foundation, Intermediate and Final link one PDF per paper under `dwpivt501gtb6.cloudfront.net/upload/students/Syllabus2022/`).
- Version: **CMA Syllabus 2022**, still the one icmai.in lists on 2026-09-29.
- News reports (Shiksha, KollegeApply, LinkedIn posts) say ICMAI is preparing **Syllabus 2026**, expected from the **June 2027** term. I could not open the ICMAI notice itself ❓. Re-check the topic map when it comes out.
- Topic map: 3 levels, 22 papers (4 Foundation, 8 Intermediate, 7 Final + 3 electives), 103 units. Units follow each paper's sections or modules, renamed in our own short words. Intermediate Paper 8 is Cost Accounting, split into 8 units.

## Sources

"CT" = Chartered Team, "Free resources for CMA Foundation, Intermediate and Final" (4 Oct 2024): https://charteredteam.com/free-resources-for-cma-foundation-intermediate-and-final-preparation/. It is the only neutral CMA-specific list I could read in full. Most other pages were coaching sellers, or Quora pages that block fetching (read from search snippets only).

| Name (as the web writes it) | Channel / playlist ID | Lang | Levels | Topics (papers) | Why trusted | Sources |
|---|---|---|---|---|---|---|
| Akash Agarwal Classes (CMA Foundation channel) | UCu6oT-LaHX7CFztFKAI6aqg | hi, en | Foundation | P1–P4 | Named for every Foundation paper; full free Foundation series | CT; openpr press release (the institute's own) |
| AAC playlist: CMA Foundation Regular Course Free Lectures | PL6BOecg3cC7XEjLkapLt6mb1MlKxXm53- | hi, en | Foundation | P1–P4 | Free full-course playlist | CT (via the teacher) |
| AAC playlist: CMA Inter Regular Courses Free Lectures | PL6BOecg3cC7Vw27RMSPEr6YVGWprGoyNm (channel ❓) | hi, en | Inter | P5, P6, P8, P10, P11, P12 | Free Inter lectures | CT (via the teacher) |
| CMA Foundation Grooming Education | UCnra_sSTg-oGAUqfXkiTYxQ | hi, en | Foundation | P1–P4 | Listed first for every Foundation paper | CT only ❓ |
| CMA Intermediate Grooming Education | UCXtc-Sxz1rT7l4mNJoVRQPQ | hi, en | Inter | P8, P11 | Listed for Cost and FM | CT only ❓ |
| Santosh Kumar - COC Education | UCzqqr31HSE-B4HcM1Cw4RiQ | hi, en | Foundation, Inter | P1–P4, P6 | Accounts teacher, CA and CMA | CT; Quora "best YouTube channel for CMA India" (snippet) |
| MEPL CMA EXCLUSIVE (Mohit Agarwal) | UCzw9zbtGSGMN-Cp-_20fZDw | hi, en | Inter, Final | P5, P10, P11, P12, P13, P17, P18, P20A | Named for eight papers | CT; Quora (snippet) |
| Deepak Classes | UClfDbwP3ACSKDKuAkbjq03w | hi, en | Inter, Final | P5, P6, P8, P9, P10, P12, P16 | CMA-focused; named for seven papers | CT only ❓ |
| CMA Junction (CMA Palak Sharma) | UCfQ6cjvUO4fCOwKEsr86Z9Q | hi, en | Inter, Final | P8, P9, P10, P14 | CMA-only channel | CT only ❓ |
| SJC Institute (CA Satish Jalan) | UChjApHrYdDgxVKGOgMQ1KnA | hi, en | Inter, Final | P8, P16, P17 | Costing, SCM and audit teacher for CMA | CT; Quora costing answer (snippet); Collegedunia reviews (snippet) |
| CA Vijay Sarda | UCjBv66pwZIbkLiryxW2_8gA | hi, en | Inter, Final | P7 (direct tax units), P15 | Direct tax for CA and CMA | CT; Zeroinfy CMA Inter Paper 7 faculty list |
| CA Amit Mahajan | UCjPOIw8shQjyLPNasWrsIDw | hi, en | Inter, Final | P7, P19 | Tax teacher; CMA-labelled videos | CT; Zeroinfy CMA Inter Paper 7 list |
| Purushottam Sir Costing Classes (CA Purushottam Aggarwal) | UCjRRmOlj6oYt6xIcMaZ9Qaw | hi, en | Inter | P8, P12 | Well-known costing teacher who also sells a CMA batch | Quora CMA Inter teacher answer (snippet); Smart Learning Destination (reseller) |
| ICMAI (official) | UCWmdXmq6yN6D5WEGLn6LR4g | en, hi | all | none yet | The exam body itself | icmai.in footer link to @ICMAI-CMA |
| Amit Panigrahi | UClK2wfqH9lTVQ-7R97KLrGA | hi | Inter, Final | P13, P16 | **Motivational/guidance**: CMA student sharing strategy, notes, some classes | CT |

Channel IDs came from channel URLs on web pages, or from `tools/resolve_channel.py` (8 handle lookups). No view, subscriber or like counts were used.

## What the checker should look at first

1. **Single-source entries** (Grooming x2, Deepak Classes, CMA Junction, Amit Panigrahi): each rests on the Chartered Team list alone. Keep or drop.
2. **Mixed CA/CMA channels** (Vijay Sarda, Amit Mahajan, Purushottam Aggarwal): the feed should draw on their CMA playlists, not the whole channel. Add playlist IDs.
3. **AAC Inter playlist**: confirm which channel owns it.
4. **MEPL**: web pages say "MEPL Classes". I chose the CMA-only channel over the main one (UCsFZTfk-d7uJeGuZWKj69jw).
5. **Gaps**: no source yet for Paper 20B (RMBI) or 20C (Entrepreneurship). CT names Sanjay Khemka (RMBI) and CA Aishwarya / CA Divyanshu Bansal (20C), but I found no second page and no channel IDs.

## Doubtful / excluded

- **vocal.media "CMA Inter Video Lectures Free Download"**: the title suggests downloads of paid lectures (possible piracy). Could not open it (403). Excluded.
- **Telegram "free lecture" channels** that surfaced in searches: not YouTube, and some share paid content. Excluded.
- **Aaditya Jain Classes (SFM)**: every "best SFM faculty" page I found is on the teacher's own site. Self-promotion only. Excluded until an independent page backs it.
- **Ranjan Periwal Classes**: its "best faculty for CMA" blog pages are its own and came back empty. Named once in CT (Inter CAA). Not added ❓.
- **Koncept Education (@konceptedu, UCTovOWnOVn1ZyiC_g_f8kXA)**: says it gives free CMA Foundation lectures, but only its own pages say so. Held back ❓.
- **Unacademy CMA**: named in CT, but I could not confirm an active CMA channel. Held back ❓.
- **"Best Teacher CA CMA Inter Final SFM English Class"**: unknown teacher, no recommending page. Excluded.
- **KCC Tutorials, Lecturewala, Zeroinfy, Smart Learning Destination**: sellers of paid courses. Used only as weak second sources, never alone.
