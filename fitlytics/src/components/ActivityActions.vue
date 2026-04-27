<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { useActivitiesStore } from '@/stores/activities';
import { getUserActionsForActivity, upsertUserAction, deleteComment } from '@/services/user-action.services';
import { ActionType, type UserActionWithUser, type CommentAction } from '../../../server/types/user-action.types';

const props = defineProps({
    activityId: {
        type: Number,
        required: true
    }
});

const userStore = useUserStore();
const activitiesStore = useActivitiesStore();

const actions = ref<UserActionWithUser[]>([]);
const newComment = ref('');
const editingCommentId = ref<number | null>(null);
const editingCommentText = ref('');

const loadActions = async () => {
    if (!props.activityId) return;
    const response = await getUserActionsForActivity(props.activityId);
    actions.value = response.data || [];
};

watch(() => props.activityId, loadActions, { immediate: true });

const comments = computed(() => actions.value.filter(a => a.type === ActionType.COMMENT) as (CommentAction & { username: string, userImg: string })[]);
const likesCount = computed(() => actions.value.filter(a => a.type === ActionType.LIKE).length);
const isLikedByUser = computed(() => {
    if (!userStore.loggedInUser) return false;
    return actions.value.some(a => a.type === ActionType.LIKE && a.userId === userStore.loggedInUser?.id);
});

const toggleLike = async () => {
    await upsertUserAction(props.activityId, { type: ActionType.LIKE });
    await loadActions();
    activitiesStore.updateUserActivityByAction(props.activityId, ActionType.LIKE, 'create');
};

const submitComment = async () => {
    if (!newComment.value.trim()) return;
    await upsertUserAction(props.activityId, { type: ActionType.COMMENT, comment: newComment.value });
    newComment.value = '';
    await loadActions();
    activitiesStore.updateUserActivityByAction(props.activityId, ActionType.COMMENT, 'create');
};

const startEdit = (comment: CommentAction) => {
    editingCommentId.value = comment.id;
    editingCommentText.value = comment.comment;
};

const cancelEdit = () => {
    editingCommentId.value = null;
    editingCommentText.value = '';
};

const saveEdit = async () => {
    if (!editingCommentText.value.trim() || !editingCommentId.value) return;
    await upsertUserAction(props.activityId, {
        id: editingCommentId.value,
        type: ActionType.COMMENT,
        comment: editingCommentText.value
    });
    editingCommentId.value = null;
    editingCommentText.value = '';
    await loadActions();
};

const removeComment = async (id: number) => {
    await deleteComment(id);
    await loadActions();
    activitiesStore.updateUserActivityByAction(props.activityId, ActionType.COMMENT, 'delete');

};
</script>

<template>
    <div class="box">

        <div class="level is-mobile mb-3">
            <div class="level-left">
                <div class="level-item">
                    <button class="button is-small" :class="isLikedByUser ? 'is-danger' : 'is-light'"
                        @click="toggleLike">
                        <span class="icon is-small">
                            <i :class="isLikedByUser ? 'fas fa-heart' : 'far fa-heart'"></i>
                        </span>
                        <span>{{ likesCount }}</span>
                    </button>
                </div>

                <div class="level-item">
                    <span class="icon-text has-text-grey is-size-7">
                        <span class="icon is-small my-1">
                            <i class="far fa-comment"></i>
                        </span>
                        <span>{{ comments.length }} comments</span>
                    </span>
                </div>
            </div>
        </div>

        <div class="content">

            <p v-if="comments.length === 0" class="has-text-grey is-size-7">
                No comments yet. Be the first to comment!
            </p>

            <div v-else class="mb-4" style="max-height: 250px; overflow-y: auto;">
                <article v-for="comment in comments" :key="comment.id" class="media mb-3">
                    <figure class="media-left">
                        <p class="image is-32x32">
                            <img :src="comment.userImg" class="is-rounded" style="object-fit: cover;" />
                        </p>
                    </figure>

                    <div class="media-content">
                        <div class="content is-size-7">

                            <p v-if="editingCommentId !== comment.id">
                                <strong>{{ comment.username }}</strong>
                                <br />
                                {{ comment.comment }}
                            </p>

                            <div v-else>
                                <textarea class="textarea is-small mb-2" v-model="editingCommentText"></textarea>

                                <div class="buttons is-right">
                                    <button class="button is-small" @click="cancelEdit">
                                        Cancel
                                    </button>
                                    <button class="button is-primary is-small" @click="saveEdit">
                                        Save
                                    </button>
                                </div>
                            </div>

                        </div>

                        <nav v-if="comment.userId === userStore.loggedInUser?.id && editingCommentId !== comment.id"
                            class="level is-mobile is-size-7">
                            <div class="level-left">
                                <a class="level-item has-text-info" @click="startEdit(comment)">
                                    Edit
                                </a>
                                <a class="level-item has-text-danger" @click="removeComment(comment.id)">
                                    Delete
                                </a>
                            </div>
                        </nav>

                    </div>
                </article>
            </div>

            <div class="field has-addons">
                <div class="control is-expanded">
                    <input class="input is-small" type="text" placeholder="Add a comment..." v-model="newComment"
                        @keyup.enter="submitComment" />
                </div>
                <div class="control">
                    <button class="button is-info is-small" @click="submitComment" :disabled="!newComment.trim()">
                        Post
                    </button>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
.media+.media {
    border-top: 1px solid #f0f0f0;
    padding-top: 10px;
}
</style>
