import fs from 'fs';
let app = fs.readFileSync('src/App.tsx', 'utf8');

// Add globalArcadeUnit state
app = app.replace(
  "const [isGlobalArcade, setIsGlobalArcade] = useState(false);",
  "const [isGlobalArcade, setIsGlobalArcade] = useState(false);\n  const [globalArcadeUnit, setGlobalArcadeUnit] = useState<any>(null);"
);

// Update handleStartGlobalGame to use setGlobalArcadeUnit
app = app.replace(
  "setSelectedUnit(mockUnit);",
  "setGlobalArcadeUnit(mockUnit);"
);

// Update selectedUnit derivation
app = app.replace(
  "const selectedUnit = UNITS_DATA[selectedUnitId] || UNITS_DATA.unit1;",
  "const selectedUnit = isGlobalArcade && globalArcadeUnit ? globalArcadeUnit : (UNITS_DATA[selectedUnitId] || UNITS_DATA.unit1);"
);

fs.writeFileSync('src/App.tsx', app);
