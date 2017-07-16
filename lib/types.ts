/*
a wchar is a 5-tuple
<id, visible, value, previous_id, next_id>
*/

export type WChar = [
  CharId, boolean, string, CharId | null, CharId | null
];

/* siteId:logicalClockTick */
export type CharId = string

export type WString = Array<WChar>

export type Operation = [
  string,
  WChar
];
