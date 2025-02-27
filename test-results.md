Fixed tests summary:
- ResourceDisplay tests now passing
- OfflineProgressModal tests now passing
- Structure tests now passing
- GameTimer tests now passing
- Fixed TypeEncoder/TextDecoder polyfill for React Router tests

Still failing:
- State/store type issues in integration tests
- TasksSlice tests failing with read-only property errors
- ResourceManager test expectations not matching
- ProgressionManager tests expecting different behavior
- BuildingList component rendering different than expected
- App.test.tsx error related to store initialization
