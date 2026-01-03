export default (initialCurrent: string = "") => ({
  current: initialCurrent,
  isOpen(id: string) {
    return id === this.current;
  },
  setCurrent(id: string) {
    if (id === this.current) {
      this.current = "";
      return;
    }
    this.current = id;
  },
});
