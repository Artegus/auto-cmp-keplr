interface Process {
    start: () => Promise<boolean>
}

export { Process }