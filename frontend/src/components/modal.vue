<script setup>
  import { defineProps,  defineEmits } from 'vue';

  defineProps({
    isVisible: Boolean,
    title: {
        type: String,
        default: "Modal Title",
    },
});

const emit = defineEmits(["close", "confirm"]);

const hide = () => {
   emit("close");
};

const confirm = () => {
   emit("confirm");
};
</script>

<template>

    <!-- Modal -->
    <div v-if="isVisible" class="modal-overlay" @click.self="hide">
      <div class="modal-content">
        <h2 class="text-xl font-bold text-white mb-2">{{ title }}</h2>
        <slot name="body">
        <!-- Default content if no slot content is provided -->
        <p class="text-gray-300">No content provided.</p>
        </slot>
        <div class="modal-buttons">
          <button @click="confirm" class="btn-join">Join</button>
          <button @click="hide" class="btn-cancel">Cancel</button>
        </div>
      </div>
    </div>

</template>

<style>
   /* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

/* Modal Content */
.modal-content {
  background: linear-gradient(145deg, #1e1e2f, #22223a);
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  width: 90%;
  max-width: 350px;
  box-shadow: 0px 0px 15px rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Buttons */
.modal-buttons {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.btn-join, .btn-cancel {
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  transition: all 0.3s ease-in-out;
}

.btn-join {
  background: linear-gradient(90deg, #4caf50, #45a049);
  color: white;
}

.btn-join:hover {
  background: #36803b;
}

.btn-cancel {
  background: linear-gradient(90deg, #ff4c4c, #d83a3a);
  color: white;
}

.btn-cancel:hover {
  background: #b83030;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-content {
    width: 80%;
  }

  .btn-join, .btn-cancel {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .modal-content {
    width: 95%;
    padding: 15px;
  }

  .btn-join, .btn-cancel {
    font-size: 0.85rem;
    padding: 8px 12px;
  }
}
</style>