# Product Spec: FieldWork V1

## Product goal

Let a foreman walk a custom home once, speak naturally, take snapshots, and leave behind clear electrical work items that workers can open later with room labels, measurements, reference photos, and simple diagrams.

## Core users

- Boss / Foreman
- Worker / Electrician
- Admin (minimal in V1)

## In scope for V1

- Sign-in
- Job organization
- Builder and job records
- Plan upload metadata
- Manual room labels
- Walkthrough session capture
- Transcript chunk storage
- AI task extraction
- Boss review before publish
- Worker task queue
- Completion photos
- Comments/questions
- Realtime task updates
- Offline-safe walkthrough queue

## Explicitly out of scope

- LiDAR
- automatic room measurement
- floor plan auto-segmentation
- BIM/CAD integration
- 3D models
- homeowner portal
- cross-trade routing
- enterprise role matrix

## Key flows

### Boss / foreman

1. Sign in
2. Create or open a job
3. Upload plans
4. Create room labels manually
5. Start walkthrough session
6. Keep camera open while talking
7. Tap snapshot / room / assignee / priority / stage / new note
8. Review AI extracted draft tasks
9. Edit, merge, discard, approve
10. Publish approved tasks
11. Review completed tasks and completion photos

### Worker

1. Sign in
2. Open assigned task list
3. Filter by job, room, stage, status, priority
4. Open task detail
5. See description, room, measurements, diagram, transcript snippet, photo
6. Mark in progress / done
7. Upload completion photo
8. Ask a question in comments

## V1 success criteria

- A foreman can capture work context in one pass without retyping everything
- No walkthrough notes are lost when service drops
- AI extraction produces structured drafts, not auto-published tasks
- Workers only see approved tasks
- Task details are specific enough to execute without re-walking the house
