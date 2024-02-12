

class PriorityQueue {
    constructor(compare) {
        this.heap = [null];
        //   a list that is used to store the heap, the first element is 
        //   null because the heap starts at index 1
        this.next_index = 1;
        //   index of the next free space in the list
        this.compare = compare;
    }

    isEmpty() {
        return this.next_index == 1;
    }

    rise(index) {
        while (index > 1) {
            //   while the current item is not in the first node
            //   (because the root node cannot rise anymore) 
            let parent_index = Math.floor(index / 2);
            //   getting index of the parent element
            let item = this.heap[index];
            let parent_item = this.heap[parent_index];
            if (this.compare(item, parent_item) > 0) {
                //   if the item is larger than its parent, perform a 
                //   swap
                this.heap[index] = parent_item;
                this.heap[parent_index] = item;

                index = parent_index;
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
        this.heap[this.next_index] = item;
        //   add item to the heap
        this.rise(this.next_index);
        //   fix the property of the heap
        this.next_index += 1;
        //   increment the index for the next element
    }

    sink(index) {
        let largest_child_index;
        //   declaring variable
        while (2 * index < this.next_index) {
            //   index of the left child of the node is 2 * index
            //   therefore this condition is satisfied as long as there
            //   at least one child of the node with this index
            //   if there are no children, then the node is already
            //   on the correct place

            if (2 * index + 1 < this.next_index) {
                //    if there is right child
                let left_item = this.heap[2 * index];
                let right_item = this.heap[2 * index + 1];
                
                if (this.compare(right_item, left_item) > 0) {
                    //   if the right child is larger
                    largest_child_index = 2 * index + 1;
                }
                else {
                    largest_child_index = 2 * index;
                }
            }
            else {
                largest_child_index = 2 * index;                
            }
            //   previous block of code finds the largest child of
            //   the current node
        
            let parent_item = this.heap[index];
            let largest_child_item = this.heap[largest_child_index];

            if (this.compare(largest_child_item, parent_item) > 0) {
                //   if the largest child is larger than its parent
                //   perform a swap
                this.heap[largest_child_index] = parent_item;
                this.heap[index] = largest_child_item;

                index = largest_child_index;
                //   the next node to consider is now at this index
            }
            else {
                break;
            }
            //   exit the loop otherwise
        }
    }

    pop() {
        //   if the queue is empty, return null
        if (this.isEmpty())
            return null;

        let item = this.heap[1];
        //   required item temporarily stored

        this.heap[1] = this.heap[this.next_index - 1];
        //   place the last elememt at the top
        this.next_index -= 1;
        //   decrement the next_index attribute

        this.heap.splice(this.next_index, 1)
        //   delete previously last element

        this.sink(1);
        //   make the new first top element of the queue to go down
        //   so the property is maintained
        return item;
    }

    peek() {
        if (this.isEmpty())
            return null;

        return this.heap[1];
    }

}

export {PriorityQueue as default};