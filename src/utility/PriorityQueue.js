

class PriorityQueue {
    constructor(compare) {
        this.heap = [null];
        //   a list that is used to store the heap, the first element is 
        //   null because the heap starts at index 1
        this.next_index = 1;
        //   index of the next free space in the list
        this.compare = compare;
    }

    rise(index) {
        while (index > 1) {
            //   while the current item is not in the first node
            //   (because the root node cannot rise anymore) 
            let parent_index = Math.floor(index / 2);
            //   getting index of the parent element
            let item = this.heap[index]
            let parent_item = this.heap[parent_index]
            if (this.compare(item, parent_item) > 0) {
                //   if the item is larger than its parent, perform a 
                //   swap
                this.heap[index] = parent_item
                this.heap[parent_index] = item

                index = parent_index
                //   the next node to consider is now a parent of
                //   the previous node
            }
            else {   
                //   if the item is less than its parent, then the 
                //   property is satisfied 
                break
                //   exit the loop
            }
        }
    }

    push(item) {
        this.heap[this.next_index] = item
        //   add item to the heap
        this.rise(this.next_index)
        //   fix the property of the heap
        this.next_index += 1
        //   increment the index for the next element
    }
}

export {PriorityQueue as default};