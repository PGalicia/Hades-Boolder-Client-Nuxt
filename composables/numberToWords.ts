export default function (num: number): string {
  // Note: For my use this is plenty
  const words: { [key: number]: string } = {
    0: 'zero',
    1: 'one',
    2: 'two',
    3: 'three',
    4: 'four',
    5: 'five'
  }

  return words[num] || num.toString()
}
