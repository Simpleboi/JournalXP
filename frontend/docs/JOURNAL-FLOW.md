# Journal Page User Flow

## Overview

The Journal Page is the core feature of JournalXP where users write, organize, and reflect on their journal entries. It provides multiple journaling modes, a secure vault for private entries, and a comprehensive archive system.

## Page Structure

The Journal Page is organized into **4 main tabs**:

1. **Journal** - Free-form writing
2. **Templates** - Structured journaling with pre-built templates
3. **Vault** - Secure storage for highly sensitive entries
4. **Archive** - Browse, search, and export past entries

### Mobile-Friendly Design

- On mobile devices, tabs display in a **2x2 grid** layout
- On desktop, tabs display in a **single row** (4 columns)
- All components are responsive and optimized for touch interaction

---

## Tab 1: Journal (Free-Form Writing)

### Purpose
Quick, unstructured journaling for daily thoughts, feelings, and experiences.

### Features

**Text Editor with Advanced Tools:**

- **Rich Text Formatting**: Bold, italic, bullet lists
- **Voice Input**: Speak your thoughts (browser permission required)
- **Undo/Redo**: Full history management (Ctrl+Z, Ctrl+Y)
- **Focus Mode**: Distraction-free fullscreen writing (Ctrl+Shift+F)
- **Word Count Tracker**: Real-time progress toward daily goal (default: 250 words)
- **Writing Timer**: Tracks active writing time
- **Auto-save Draft**: Entries are saved locally until submitted

**Writing Stats Panel:**

- Current word count vs. goal
- Writing session time
- Progress bar (turns green when goal is met)

**Entry Metadata:**

- **Mood Selection**: Choose your emotional state
- **Tags**: Add custom tags for organization
- **Favorite Toggle**: Mark important entries

**Focus Mode (Fullscreen):**

- Press the maximize icon or use **Ctrl+Shift+F**
- Removes all distractions
- Shows minimal stats at bottom
- Press **Escape** to exit or click minimize icon

### User Flow

1. Navigate to Journal Page → **Journal Tab** (default)
2. Start typing in the text editor
3. (Optional) Use formatting tools, voice input, or focus mode
4. (Optional) Select mood and add tags
5. Click **Save Entry** button
6. Entry is saved to database and **awards 30 XP**
7. Entry appears in Archive tab

### Keyboard Shortcuts

- **Ctrl+S**: Save entry
- **Ctrl+Z**: Undo
- **Ctrl+Y**: Redo
- **Ctrl+Shift+F**: Toggle focus mode
- **Escape**: Exit focus mode or cancel

---

## Tab 2: Templates (Structured Journaling)

### Purpose

Guided journaling with structured prompts for specific reflection types.

### Available Templates

**1. Daily Reflection**

- What went well today?
- What could have gone better?
- What am I grateful for?
- Tomorrow's intentions

**2. Gratitude Journal**

- 3 things I'm grateful for today
- Someone who made a positive impact
- A small moment of joy
- Why today mattered

**3. Goal Setting**

- My main goal
- Why this matters
- Action steps
- Potential obstacles
- Success indicators

**4. Mood Check-In**

- Current mood rating (1-10)
- Physical sensations
- Thoughts/worries
- What might help

**5. Weekly Review**

- Wins from this week
- Challenges faced
- Lessons learned
- Next week's priorities

**6. Dream Journal**

- Dream description
- Emotions in dream
- Symbols/themes
- Personal interpretation

### Template Features

- **Pre-filled Prompts**: Each template has specific guiding questions
- **Multi-field Forms**: Structured input fields for each section
- **Template Preview**: See template structure before selecting
- **Theme-Aware Styling**: Templates adapt to user's selected theme
- **Save & Submit**: All fields saved together as one entry

### User Flow

1. Navigate to Journal Page → **Templates Tab**
2. Click **Browse Templates** button
3. Template selector modal opens showing all available templates
4. Click on a template card to select it
5. Modal closes, template form renders with all prompts
6. Fill in each section (guided by prompts)
7. (Optional) Select mood and add tags
8. Click **Save Entry** button
9. Structured entry saved to database and **awards 30 XP**

### Template Selector UI

- **Modal Dialog**: Centered overlay with template grid
- **Template Cards**: Each card shows:
  - Template icon (emoji)
  - Template name
  - Brief description
  - Number of prompts
- **Current Selection**: Highlighted with themed border
- **Responsive Grid**: Adapts to screen size

---

## Tab 3: Vault (Secure Storage)

### Purpose
A dedicated secure space for highly sensitive or private journal entries that users want to keep separate from regular entries.

### Features

- **Separate Storage**: Vault entries are stored in a different collection
- **Privacy Focus**: Clearly labeled as private and secure
- **Same Writing Tools**: Full text editor with all features from Journal tab
- **No Sharing**: Vault entries are never shared or exported to community
- **Password Protection**: (Future enhancement - currently authentication-based)

### User Flow

1. Navigate to Journal Page → **Vault Tab**
2. Write entry using the same editor as Journal tab
3. (Optional) Select mood and add tags
4. Click **Save to Vault** button
5. Entry saved to separate `vault` collection
6. Vault entries visible only in Vault tab, not in Archive

### Security

- Vault entries are stored in a separate Firestore subcollection: `users/{uid}/vaultEntries`
- Only accessible to authenticated user
- Not included in exports or community features
- Clearly marked with lock icon 🔒

---

## Tab 4: Archive (Browse & Manage Entries)

### Purpose
Search, filter, browse, and export all past journal entries.

### Views

The Archive has **2 viewing modes**:

#### List View (Default)

**Features:**
- Chronological list of all entries
- Each entry shows:
  - Date and time
  - Entry preview (first 150 characters)
  - Mood indicator
  - Tags
  - Favorite star
  - Word count
- **Expandable Cards**: Click to read full entry
- **Edit/Delete Actions**: Manage individual entries
- **Infinite Scroll**: Load more entries as you scroll

#### Calendar View

**Features:**
- **Visual Calendar**: Month view with date picker
- **Entry Indicators**: Dates with entries are highlighted (indigo background)
- **Date Selection**: Click a date to view all entries from that day
- **Entry Count**: Shows number of entries per selected date
- **Side Panel**: Selected date's entries displayed on the right
- **Month Navigation**: Arrow buttons to move between months
- **Year Display**: Current month and year shown in center

**Calendar UI:**
- Left side: Calendar grid
- Right side: Entries for selected date
- Legend: Shows which dates have entries (indigo circle indicator)
- Mobile responsive: Stacks vertically on small screens

### Search & Filter Tools

**Available Filters:**

1. **Search Bar**
   - Searches entry content
   - Searches tags
   - Real-time filtering

2. **Mood Filter**
   - Dropdown with all mood options
   - Shows entries matching selected mood
   - Default: "All Moods"

3. **Type Filter**
   - Free Writing
   - Guided (Templates)
   - Gratitude
   - Default: "All Types"

4. **Tag Filter**
   - Dynamically populated with user's tags
   - Only shows if user has created tags
   - Default: "All Tags"

5. **Favorites Toggle**
   - Badge button with star icon
   - Click to show only favorited entries
   - Click again to show all

**Filter Summary:**
- Shows "Showing X of Y entries" when filters are active
- All filters work together (AND logic)

### Export Entries

**Export Button** (top-right of Archive header):
- Icon: Download symbol
- Click to open export options
- Export formats:
  - **JSON**: Complete data structure
  - **CSV**: Spreadsheet format
  - **TXT**: Plain text format
  - **PDF**: Formatted document (future enhancement)
- Downloads file to user's device
- Filename includes date: `journal-entries-2025-11-24.json`

### Entry Statistics

- **Total Entry Count**: Badge showing total entries
- **Word Count**: Total words written across all entries
- **Streak Information**: Current writing streak
- **Most Common Mood**: Data visualization (future enhancement)

### User Flow (Archive)

**List View:**
1. Navigate to Journal Page → **Archive Tab**
2. (Optional) Use search bar or filters to narrow results
3. Click on an entry card to expand and read full content
4. Click **Edit** to modify entry
5. Click **Delete** to remove entry (confirmation required)
6. Click **Export** button to download entries

**Calendar View:**
1. Navigate to Journal Page → **Archive Tab**
2. Click **Calendar View** tab
3. Browse calendar to see dates with entries (highlighted in indigo)
4. Click on a highlighted date
5. View all entries from that date in right panel
6. Click on individual entry cards to read more

---

## XP Rewards

All journal entries award **30 XP** upon saving:
- Journal tab entries: **30 XP**
- Template entries: **30 XP**
- Vault entries: **30 XP**

XP is awarded when the entry is successfully saved to the database.

---

## Theme Support

All journal components support **dynamic theming**:
- Text colors adapt to selected theme
- Background colors use theme palette
- Border colors themed
- Accent colors for highlights
- 20+ themes available (Default, Ocean Breeze, Sunset, Forest, etc.)

Themes are applied via the **ThemeContext** using inline styles on components.

---

## Mobile Optimizations

### Journal Tab (Mobile)
- Toolbar buttons wrap to multiple rows
- Stats counter takes full width on small screens
- Text size reduced: `text-xs` on mobile, `text-sm` on desktop
- Focus mode buttons show icons only (text hidden on mobile)
- Padding reduced: `p-2` on mobile, `p-4` on desktop

### Templates Tab (Mobile)
- Template selector modal full-screen on mobile
- Template cards stack vertically
- Larger touch targets for buttons
- Simplified template preview

### Archive Tab (Mobile)
- Filters stack vertically
- Entry cards full-width
- Calendar view:
  - Calendar and entries stack vertically
  - Calendar centered and full-width
  - Touch-friendly date selection

### Tabs (Mobile)
- 2x2 grid layout (2 tabs per row)
- Larger touch targets
- Shortened labels: "The Vault" → "Vault"
- Responsive text: `text-xs` on mobile, `text-sm` on desktop

---

## Accessibility Features

- **Keyboard Navigation**: All interactive elements keyboard-accessible
- **ARIA Labels**: Screen reader support
  - Tab labels include descriptions
  - Buttons have clear labels
  - Form fields properly labeled
- **Focus Indicators**: Visible focus states on all inputs
- **Skip Links**: Skip to main content link for screen readers
- **Color Contrast**: Meets WCAG AA standards
- **Touch Targets**: Minimum 44px for mobile (WCAG AAA)

---

## Data Flow

### Creating an Entry

1. User writes content in editor
2. User selects mood, adds tags (optional)
3. User clicks Save button
4. Frontend validation:
   - Content not empty
   - Word count calculated
5. API request: `POST /api/journals`
6. Backend creates entry:
   - Adds timestamp
   - Stores in `users/{uid}/journalEntries` collection
   - Updates user stats
   - Awards 30 XP
   - Updates level/rank if needed
7. Response returns created entry
8. Frontend updates local state
9. Entry appears in Archive

### Viewing Entries

1. User navigates to Archive tab
2. Frontend requests: `GET /api/journals`
3. Backend queries Firestore:
   - Filters by user ID
   - Sorts by date (newest first)
   - Returns all entries
4. Frontend receives entries array
5. Applies client-side filters (if any)
6. Renders entries in List or Calendar view

### Deleting an Entry

1. User clicks Delete button on entry
2. Confirmation modal appears
3. User confirms deletion
4. API request: `DELETE /api/journals/:id`
5. Backend:
   - Verifies ownership
   - Deletes entry from Firestore
   - Updates user stats (decrements count)
   - **Does NOT deduct XP**
6. Frontend removes entry from local state
7. UI updates immediately

---

## Technical Details

### Components

**Journal Tab:**
- `Journal.tsx` - Main journal component
- `JournalTextEditor.tsx` - Rich text editor with toolbar
- `EnhancedJournal.tsx` - Enhanced version with additional features

**Templates Tab:**
- `TemplatedJournal.tsx` - Template-based journaling container
- `TemplateSelector.tsx` - Template browser modal
- `StructuredTemplateRenderer.tsx` - Dynamic form renderer
- `JournalTemplates.ts` - Template definitions

**Vault Tab:**
- `VaultSection.tsx` - Secure vault interface

**Archive Tab:**
- `ReflectionArchive.tsx` - Main archive container
- `EnhancedReflectionListView.tsx` - List view with entry cards
- `ReflectionCalendarView.tsx` - Calendar view with date picker
- `ReflectionListCard.tsx` - Individual entry card component
- `ExportEntries.tsx` - Export functionality

**Shared Components:**
- `JournalTextEditor.tsx` - Used in all tabs
- Calendar UI component (`calendar.tsx`)

### Hooks Used

- `useAuth()` - Authentication state
- `useUserData()` - User profile data
- `useTheme()` - Theme colors and styling
- `useWritingTimer()` - Track writing time
- `useWordCountGoal()` - Word count progress
- `useKeyboardShortcuts()` - Keyboard command handling
- `useUndoRedo()` - Undo/redo history

### State Management

- **Local State**: React useState for UI state
- **Context State**: Auth, UserData, Theme via Context API
- **Server State**: Fetched from API, cached locally
- **Draft State**: Auto-saved to localStorage

### API Endpoints

- `GET /api/journals` - Fetch all entries
- `POST /api/journals` - Create new entry
- `DELETE /api/journals/:id` - Delete entry
- `DELETE /api/journals/all` - Delete all entries

---

## Future Enhancements

- **Rich Media**: Image and audio attachment support
- **Collaborative Journaling**: Shared entries with friends/therapists
- **AI Insights**: Sentiment analysis and pattern detection
- **Custom Templates**: User-created template builder
- **Advanced Search**: Full-text search with filters
- **Data Visualization**: Charts and graphs of journaling habits
- **Reminders**: Daily journaling notifications
- **Vault Password**: Additional PIN/password layer for vault entries
- **PDF Export**: Formatted PDF export with styling
- **Voice Journaling**: Full voice-to-text entry creation

---

## User Tips

### Best Practices

1. **Write Daily**: Build a consistent journaling habit for better insights
2. **Use Tags**: Organize entries by themes (work, family, health, etc.)
3. **Try Templates**: Use structured templates when you need guidance
4. **Utilize Vault**: Keep truly private thoughts separate from regular entries
5. **Review Archive**: Regularly revisit past entries to track growth
6. **Set Word Goals**: Challenge yourself to write more each session
7. **Favorite Important Entries**: Mark entries you want to revisit quickly
8. **Export Regularly**: Back up your entries monthly

### Troubleshooting

**Entry not saving:**
- Check internet connection
- Ensure you're logged in
- Verify content is not empty
- Check browser console for errors

**Calendar not showing entries:**
- Refresh the page
- Verify entries exist in List View
- Check date filter is not excluding entries

**Voice input not working:**
- Grant microphone permission in browser
- Ensure browser supports Web Speech API (Chrome, Edge)
- Check microphone is not used by another app

---

## Privacy & Security

- All entries are **private by default**
- Only accessible to the authenticated user
- Encrypted in transit (HTTPS)
- Stored in Firebase Firestore with security rules
- No third-party analytics on entry content
- Vault entries in separate collection for added privacy
- Users can delete all data at any time

---

**Last Updated**: 2025-11-24
**Version**: 2.1.4
