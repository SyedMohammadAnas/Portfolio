#include <stdio.h>

// Merge two sorted halves into one sorted array
void merge(int arr[], int temp[], int left, int mid, int right) {
    int leftIndex = left;       // starting index of left half
    int rightIndex = mid + 1;   // starting index of right half
    int mergeIndex = left;      // index for merged array

    // Compare elements from left and right halves
    while (leftIndex <= mid && rightIndex <= right) {
        if (arr[leftIndex] <= arr[rightIndex]) {
            temp[mergeIndex++] = arr[leftIndex++];
        } else {
            temp[mergeIndex++] = arr[rightIndex++];
        }
    }

    // Copy remaining elements from left half
    while (leftIndex <= mid) {
        temp[mergeIndex++] = arr[leftIndex++];
    }

    // Copy remaining elements from right half
    while (rightIndex <= right) {
        temp[mergeIndex++] = arr[rightIndex++];
    }

    // Copy merged elements back into original array
    for (int i = left; i <= right; i++) {
        arr[i] = temp[i];
    }
}

// Recursive MergeSort function
void mergeSort(int arr[], int temp[], int left, int right) {
    if (left < right) {
        int mid = (left + right) / 2;

        // Sort left half
        mergeSort(arr, temp, left, mid);

        // Sort right half
        mergeSort(arr, temp, mid + 1, right);

        // Merge two sorted halves
        merge(arr, temp, left, mid, right);
    }
}

int main() {
    int n;
    printf("Enter the number of elements: ");
    scanf("%d", &n);

    int arr[n], temp[n];
    printf("Enter %d elements:\n", n);
    for (int i = 0; i < n; i++) {
        scanf("%d", &arr[i]);
    }

    mergeSort(arr, temp, 0, n - 1);

    printf("Sorted array:\n");
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    printf("\n");

    return 0;
}
