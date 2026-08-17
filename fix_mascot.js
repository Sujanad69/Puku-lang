import fs from 'fs';

let comp = fs.readFileSync('src/components/MascotIsland.tsx', 'utf8');

comp = comp.replace(
  "{user && user.photoURL ? (\\n              <img src={user.photoURL} alt=\"avatar\" className=\"w-5 h-5 rounded-full\" />\\n            ) : null}",
  ""
);

// Ah wait, I need to know exactly what the string looks like.
