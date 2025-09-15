"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Campaign {
  id: string
  name: string
  createdAt: string
  status: "active" | "completed" | "draft"
  description?: string
  questionCount: number
}

interface Question {
  id: string
  campaignId: string
  question: string
  answerType: "static" | "ai-validated"
  answer: string
  startTime: string
  endTime: string
  status: "upcoming" | "active" | "ended"
}

interface LeaderboardEntry {
  id: string
  campaignId: string
  username: string
  score: number
  completedAt: string
  timeSpent: number // in seconds
}

interface AppState {
  campaigns: Campaign[]
  questions: Question[]
  leaderboard: LeaderboardEntry[]
  viewMode: "grid" | "list"
  addCampaign: (campaign: Omit<Campaign, "id" | "createdAt" | "questionCount">) => string
  updateCampaign: (id: string, updates: Partial<Campaign>) => void
  deleteCampaign: (id: string) => void
  addQuestion: (question: Omit<Question, "id" | "status">) => void
  updateQuestion: (id: string, updates: Partial<Question>) => void
  deleteQuestion: (id: string) => void
  getCampaignQuestions: (campaignId: string) => Question[]
  addLeaderboardEntry: (entry: Omit<LeaderboardEntry, "id">) => void
  getCampaignLeaderboard: (campaignId: string) => LeaderboardEntry[]
  setViewMode: (mode: "grid" | "list") => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      campaigns: [
        {
          id: "1",
          name: "Math Riddles Challenge",
          createdAt: "2024-01-15",
          status: "active",
          questionCount: 2,
        },
        {
          id: "2",
          name: "Logic Puzzles",
          createdAt: "2024-01-10",
          status: "completed",
          questionCount: 1,
        },
        {
          id: "3",
          name: "Word Games",
          createdAt: "2024-01-08",
          status: "draft",
          questionCount: 0,
        },
        {
          id: "4",
          name: "Blockchain & Crypto Quiz",
          createdAt: "2024-01-12",
          status: "active",
          questionCount: 3,
        },
      ],
      questions: [
        {
          id: "1",
          campaignId: "1",
          question: "What has keys but no locks, space but no room, and you can enter but not go inside?",
          answerType: "static",
          answer: "keyboard",
          startTime: "2024-01-20T10:00:00",
          endTime: "2024-01-20T18:00:00",
          status: "active",
        },
        {
          id: "2",
          campaignId: "1",
          question:
            "I am not alive, but I grow; I don't have lungs, but I need air; I don't have a mouth, but water kills me. What am I?",
          answerType: "ai-validated",
          answer: "Fire or flame - something that burns and consumes oxygen",
          startTime: "2024-01-21T09:00:00",
          endTime: "2024-01-21T17:00:00",
          status: "upcoming",
        },
        {
          id: "3",
          campaignId: "4",
          question: "What is the maximum supply of Bitcoin that can ever exist?",
          answerType: "static",
          answer: "21 million",
          startTime: "2024-01-22T10:00:00",
          endTime: "2024-01-22T18:00:00",
          status: "active",
        },
        {
          id: "4",
          campaignId: "4",
          question: "Which consensus mechanism does Ethereum 2.0 use?",
          answerType: "static",
          answer: "Proof of Stake",
          startTime: "2024-01-23T09:00:00",
          endTime: "2024-01-23T17:00:00",
          status: "upcoming",
        },
        {
          id: "5",
          campaignId: "4",
          question: "What does DeFi stand for and what is its main purpose in the blockchain ecosystem?",
          answerType: "ai-validated",
          answer:
            "Decentralized Finance - aims to recreate traditional financial systems without intermediaries using blockchain technology",
          startTime: "2024-01-24T10:00:00",
          endTime: "2024-01-24T18:00:00",
          status: "upcoming",
        },
      ],

      leaderboard: [
        {
          id: "1",
          campaignId: "1",
          username: "CryptoMaster",
          score: 95,
          completedAt: "2024-01-20T15:30:00",
          timeSpent: 180,
        },
        {
          id: "2",
          campaignId: "1",
          username: "RiddleSolver",
          score: 87,
          completedAt: "2024-01-20T16:45:00",
          timeSpent: 240,
        },
        {
          id: "3",
          campaignId: "4",
          username: "BlockchainPro",
          score: 100,
          completedAt: "2024-01-22T14:20:00",
          timeSpent: 120,
        },
        {
          id: "4",
          campaignId: "4",
          username: "CryptoNinja",
          score: 92,
          completedAt: "2024-01-22T15:10:00",
          timeSpent: 150,
        },
      ],

      viewMode: "grid",

      addCampaign: (campaignData) => {
        const id = Date.now().toString()
        const campaign: Campaign = {
          ...campaignData,
          id,
          createdAt: new Date().toISOString(),
          questionCount: 0,
        }
        set((state) => ({
          campaigns: [...state.campaigns, campaign],
        }))
        return id
      },

      updateCampaign: (id, updates) => {
        set((state) => ({
          campaigns: state.campaigns.map((campaign) => (campaign.id === id ? { ...campaign, ...updates } : campaign)),
        }))
      },

      deleteCampaign: (id) => {
        set((state) => ({
          campaigns: state.campaigns.filter((campaign) => campaign.id !== id),
          questions: state.questions.filter((question) => question.campaignId !== id),
        }))
      },

      addQuestion: (questionData) => {
        const id = Date.now().toString()
        const question: Question = {
          ...questionData,
          id,
          status: new Date(questionData.startTime) > new Date() ? "upcoming" : "active",
        }
        set((state) => ({
          questions: [...state.questions, question],
          campaigns: state.campaigns.map((campaign) =>
            campaign.id === questionData.campaignId
              ? { ...campaign, questionCount: campaign.questionCount + 1 }
              : campaign,
          ),
        }))
      },

      updateQuestion: (id, updates) => {
        set((state) => ({
          questions: state.questions.map((question) => (question.id === id ? { ...question, ...updates } : question)),
        }))
      },

      deleteQuestion: (id) => {
        const question = get().questions.find((q) => q.id === id)
        if (question) {
          set((state) => ({
            questions: state.questions.filter((q) => q.id !== id),
            campaigns: state.campaigns.map((campaign) =>
              campaign.id === question.campaignId
                ? { ...campaign, questionCount: Math.max(0, campaign.questionCount - 1) }
                : campaign,
            ),
          }))
        }
      },

      getCampaignQuestions: (campaignId) => {
        return get().questions.filter((question) => question.campaignId === campaignId)
      },

      addLeaderboardEntry: (entryData) => {
        const id = Date.now().toString()
        const entry: LeaderboardEntry = {
          ...entryData,
          id,
        }
        set((state) => ({
          leaderboard: [...state.leaderboard, entry],
        }))
      },

      getCampaignLeaderboard: (campaignId) => {
        return get()
          .leaderboard.filter((entry) => entry.campaignId === campaignId)
          .sort((a, b) => b.score - a.score || a.timeSpent - b.timeSpent)
      },

      setViewMode: (mode) => {
        set({ viewMode: mode })
      },
    }),
    {
      name: "riddlerush-storage",
    },
  ),
)
