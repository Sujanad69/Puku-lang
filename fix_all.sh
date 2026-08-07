#!/bin/bash
find src -name "*.tsx" -exec sed -i 's/.*<[A-Z].*className=.*lucide-react.*//g' {} +
